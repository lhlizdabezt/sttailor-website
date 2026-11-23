import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker from "../src/worker.js";
import { tripadvisorEmbedPath } from "../src/security-policy.js";
import { tailoringPages } from "../src/tailoring-pages.js";

const env = {
  ASSETS: {
    fetch: async (request) => new Response(new URL(request.url).pathname === "/not-found"
      ? "Page not found" : "Published page", { headers: { "Content-Type": "text/html" } })
  }
};

test("retired query endpoints return a non-indexable 404 without redirecting", async () => {
  for (const query of ["attachment_id=3263", "wc-ajax=%25%25endpoint%25%25", "wc-ajax=get_refreshed_fragments"]) {
    const response = await worker.fetch(new Request(`https://sttailor.com/?${query}`), env);
    assert.equal(response.status, 404, query);
    assert.equal(response.headers.get("Location"), null, query);
    assert.match(response.headers.get("X-Robots-Tag"), /noindex/, query);
    assert.equal(await response.text(), "Page not found", query);
  }
});

test("campaign parameters remain on published pages and legacy redirects", async () => {
  const page = await worker.fetch(new Request("https://sttailor.com/?utm_source=facebook&utm_medium=social&fbclid=test"), env);
  assert.equal(page.status, 200);
  assert.equal(await page.text(), "Published page");
  const legacy = await worker.fetch(new Request("https://sttailor.com/contact/?utm_source=instagram"), env);
  assert.equal(legacy.status, 301);
  assert.equal(legacy.headers.get("Location"), "https://sttailor.com/lien-he/?utm_source=instagram");
});

test("nested canonical redirects retain query parameters and unknown child paths return 404", async () => {
  for (const { route } of tailoringPages) {
    const response = await worker.fetch(new Request(`https://sttailor.com${route.slice(0, -1)}?utm_source=profile`), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Location"), `https://sttailor.com${route}?utm_source=profile`);
  }
  const missing = await worker.fetch(new Request("https://sttailor.com/dich-vu/not-a-service/"), env);
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("Location"), null);
});

test("llms.txt advertises UTF-8 for GET and HEAD even if the asset omits its charset", async () => {
  const copy = "Địa chỉ: Lầu 1, 258 Lê Thánh Tôn, Phường Tân Định";
  const textEnv = { ASSETS: { fetch: async (request) => new Response(request.method === "HEAD" ? null : copy, { headers: { "Content-Type": "text/plain" } }) } };
  for (const method of ["GET", "HEAD"]) {
    const response = await worker.fetch(new Request("https://sttailor.com/llms.txt", { method }), textEnv);
    assert.equal(response.headers.get("Content-Type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), method === "GET" ? copy : "");
  }
});

test("unmatched retired products retain a true 404 instead of a homepage redirect", async () => {
  const response = await worker.fetch(new Request("https://sttailor.com/product/diamond-necklace/"), env);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Location"), null);
});

test("security disclosure is a public text resource while unknown well-known paths remain missing", async () => {
  const disclosureEnv = { ASSETS: { fetch: async () => new Response("Contact: mailto:contact.sttailor@gmail.com\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } }) } };
  for (const method of ["GET", "HEAD"]) {
    const response = await worker.fetch(new Request("https://sttailor.com/.well-known/security.txt", { method }), disclosureEnv);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("Content-Type"), /^text\/plain/);
    assert.equal(response.headers.get("Cache-Control"), "public, max-age=3600");
  }
  const missing = await worker.fetch(new Request("https://sttailor.com/.well-known/private.txt"), env);
  assert.equal(missing.status, 404);
});

test("retired tailoring pages redirect to related content and preserve campaign parameters", async () => {
  const redirects = [
    ["/product-category/blazer/", "/gallery/#album-suits"],
    ["/product-category/trouser/trouser-women/", "/gallery/#album-womenswear"],
    ["/san-pham/blazer-mau-be/", "/gallery/#album-suits"],
    ["/product/mens-formal-blazer-jacket/", "/gallery/#album-suits"],
    ["/mens-suits-a-timeless-wardrobe-essential-for-the-modern-gentleman/", "/dich-vu/"],
    ["/office-suits-a-professional-appearance-that-leads-to-success/", "/dich-vu/"],
  ];
  for (const [oldPath, newPath] of redirects) {
    const destination = new URL(newPath, "https://sttailor.com");
    destination.search = "?utm_source=google";
    const response = await worker.fetch(new Request(`https://sttailor.com${oldPath}?utm_source=google`), env);
    assert.equal(response.status, 301, oldPath);
    assert.equal(response.headers.get("Location"), destination.href, oldPath);
    if (destination.hash) {
      const gallery = readFileSync(new URL("../dist/gallery/index.html", import.meta.url), "utf8");
      assert.ok(gallery.includes(`id="${destination.hash.slice(1)}"`), newPath);
    }
  }
});

test("the Worker serves every route in the public build manifest", async () => {
  const { routes } = JSON.parse(readFileSync(new URL("../dist/build-manifest.json", import.meta.url), "utf8"));
  assert.ok(routes.length);
  for (const route of routes) {
    const response = await worker.fetch(new Request(new URL(route, "https://sttailor.com")), env);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("X-Robots-Tag"), /^index, follow\b/, route);
    const policy = response.headers.get("Content-Security-Policy");
    assert.match(policy, /(?:^|; )script-src 'self' 'sha256-/);
    assert.match(policy, /(?:^|; )script-src-attr 'none'/);
    assert.doesNotMatch(policy, /'unsafe-(?:inline|eval)'/);
    assert.ok(!policy.includes("https://www.tripadvisor.com"), route);
    assert.equal(await response.text(), "Published page", route);
  }
});

test("the review embed has its own script policy and stays out of search results", async () => {
  const embed = await worker.fetch(new Request(`https://sttailor.com${tripadvisorEmbedPath}`), env);
  assert.equal(embed.status, 200);
  assert.equal(embed.headers.get("X-Robots-Tag"), "noindex, follow");
  assert.match(embed.headers.get("Content-Security-Policy"), /script-src 'self' https:\/\/www\.jscache\.com https:\/\/www\.tripadvisor\.com/);
  assert.doesNotMatch(embed.headers.get("Content-Security-Policy"), /googletagmanager|clarity\.ms|facebook\.net/);
});

test("retired suit-care article redirects to its relevant guide and preserves attribution", async () => {
  const oldPath = "/10-cach-bao-quan-vest-nam-luon-nhu-moi-bi-quyet-giu-phom-chuan-theo-thoi-gian/";
  for (const method of ["GET", "HEAD"]) {
    const response = await worker.fetch(new Request(`https://sttailor.com${oldPath}?utm_source=bing`, { method }), env);
    assert.equal(response.status, 301, method);
    assert.equal(response.headers.get("Location"), "https://sttailor.com/bao-quan-giat-la/?utm_source=bing", method);
  }
});

test("retired body-fit article redirects to fitting guidance without losing campaign parameters", async () => {
  for (const method of ["GET", "HEAD"]) {
    const response = await worker.fetch(new Request("https://sttailor.com/how-to-choose-the-right-mens-suit-for-your-body-type/?utm_source=google&gclid=example", { method }), env);
    assert.equal(response.status, 301, method);
    assert.equal(response.headers.get("Location"), "https://sttailor.com/quy-trinh-thu-do/?utm_source=google&gclid=example", method);
  }
});
