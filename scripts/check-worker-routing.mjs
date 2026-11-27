import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker from "../src/worker.js";
import { tripadvisorEmbedPath } from "../src/security-policy.js";
import { tailoringPages } from "../src/tailoring-pages.js";
import { showcasePages } from "../src/showcase-pages.js";
import { fittingFilm } from "../src/fitting-film.js";

const env = {
  ASSETS: {
    fetch: async (request) => new Response(new URL(request.url).pathname === "/not-found"
      ? "Page not found" : "Published page", { headers: { "Content-Type": "text/html" } })
  }
};

test("the fitting film supports media seeking on Workers Static Assets", async () => {
  const file = new Uint8Array([0, 1, 2, 3, 4, 5]);
  const filmEnv = {
    ASSETS: {
      fetch: async (request) => new Response(request.method === "HEAD" ? null : file, {
        headers: { "Content-Type": "video/mp4", "Content-Length": String(file.length), ETag: '"film-revision"' }
      })
    }
  };
  const fetchFilm = (headers, method = "GET") =>
    worker.fetch(new Request(`https://sttailor.com${fittingFilm.src}`, { headers, method }), filmEnv);

  const head = await fetchFilm({}, "HEAD");
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("Accept-Ranges"), "bytes");
  assert.equal(head.headers.get("Content-Length"), "6");
  assert.equal(head.body, null);

  for (const [range, start, end] of [["bytes=0-1", 0, 1], ["bytes=4-", 4, 5], ["bytes=-2", 4, 5], ["bytes=1-99", 1, 5]]) {
    const partial = await fetchFilm({ Range: range, "If-Range": '"film-revision"' });
    assert.equal(partial.status, 206, range);
    assert.equal(partial.headers.get("Content-Type"), "video/mp4", range);
    assert.equal(partial.headers.get("Content-Range"), `bytes ${start}-${end}/6`, range);
    assert.equal(partial.headers.get("Content-Length"), String(end - start + 1), range);
    assert.deepEqual(new Uint8Array(await partial.arrayBuffer()), file.subarray(start, end + 1), range);
  }

  const stale = await fetchFilm({ Range: "bytes=0-1", "If-Range": '"previous-revision"' });
  assert.equal(stale.status, 200);
  assert.deepEqual(new Uint8Array(await stale.arrayBuffer()), file);

  for (const range of ["bytes=6-", "bytes=3-2", "bytes=-0"]) {
    const unsatisfiable = await fetchFilm({ Range: range });
    assert.equal(unsatisfiable.status, 416, range);
    assert.equal(unsatisfiable.headers.get("Content-Range"), "bytes */6", range);
    assert.equal(unsatisfiable.body, null, range);
  }
});

test("retired query endpoints return a non-indexable 404 without redirecting", async () => {
  for (const query of ["attachment_id=3263", "wc-ajax=%25%25endpoint%25%25", "wc-ajax=get_refreshed_fragments"]) {
    const response = await worker.fetch(new Request(`https://sttailor.com/?${query}`), env);
    assert.equal(response.status, 404, query);
    assert.equal(response.headers.get("Location"), null, query);
    assert.match(response.headers.get("X-Robots-Tag"), /noindex/, query);
    assert.equal(await response.text(), "Page not found", query);
  }
});

test("the internal error documents and asset headers are not public routes", async () => {
  const requestedAssets = [];
  const errorEnv = { ASSETS: { fetch: async (request) => {
    requestedAssets.push(new URL(request.url).pathname);
    return new Response(request.method === "HEAD" ? null : "Page not found", { headers: { "Content-Type": "text/html" } });
  } } };
  for (const route of ["/404.html", "/404", "/not-found.html", "/not-found", "/_headers"]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await worker.fetch(new Request(`https://sttailor.com${route}`, { method }), errorEnv);
      assert.equal(response.status, 404, route);
      assert.equal(response.headers.get("Location"), null, route);
      assert.equal(response.headers.get("X-Robots-Tag"), "noindex, follow", route);
      assert.equal(await response.text(), method === "GET" ? "Page not found" : "", route);
    }
  }
  assert.deepEqual([...new Set(requestedAssets)], ["/not-found"]);
});

test("conditions for a missing URL cannot strip the 404 page body", async () => {
  const errorEnv = { ASSETS: { fetch: async (request) => {
    assert.equal(request.headers.get("If-None-Match"), null);
    assert.equal(request.headers.get("Range"), null);
    return new Response("Page not found", { headers: { ETag: '"fallback-page"' } });
  } } };
  const request = new Request("https://sttailor.com/missing/", {
    headers: { "If-None-Match": '"fallback-page"', Range: "bytes=0-1" }
  });
  const response = await worker.fetch(request, errorEnv);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("ETag"), null);
  assert.equal(await response.text(), "Page not found");
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
  for (const { route } of [...tailoringPages, ...showcasePages]) {
    const response = await worker.fetch(new Request(`https://sttailor.com${route.slice(0, -1)}?utm_source=profile`), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Location"), `https://sttailor.com${route}?utm_source=profile`);
  }
  for (const route of ["/dich-vu/not-a-service/", "/san-pham/not-a-garment/", "/du-an/not-a-project/"]) {
    const missing = await worker.fetch(new Request(new URL(route, "https://sttailor.com")), env);
    assert.equal(missing.status, 404);
    assert.equal(missing.headers.get("Location"), null);
  }
});

test("llms.txt preserves UTF-8 on GET, HEAD and cache revalidation", async () => {
  const copy = "Địa chỉ: Lầu 1, 258 Lê Thánh Tôn, Phường Tân Định";
  const etag = '"llms-fixture"';
  const textEnv = { ASSETS: { fetch: async (request) => {
    const validated = request.headers.get("If-None-Match") === etag;
    return new Response(!validated && request.method === "GET" ? copy : null, {
      status: validated ? 304 : 200,
      headers: { "Content-Type": "text/plain", ETag: etag }
    });
  } } };
  for (const method of ["GET", "HEAD"]) {
    const response = await worker.fetch(new Request("https://sttailor.com/llms.txt", { method }), textEnv);
    assert.equal(response.headers.get("Content-Type"), "text/plain; charset=utf-8");
    assert.equal(response.headers.get("Cache-Control"), "public, max-age=0, must-revalidate");
    assert.equal(await response.text(), method === "GET" ? copy : "");
  }
  const cached = await worker.fetch(new Request("https://sttailor.com/llms.txt", { headers: { "If-None-Match": etag } }), textEnv);
  assert.equal(cached.status, 304);
  assert.equal(cached.headers.get("Content-Type"), "text/plain; charset=utf-8");
  assert.equal(cached.headers.get("Cache-Control"), "public, max-age=0, must-revalidate");
});

test("only fingerprinted asset paths are immutable and errors cannot enter the browser cache", async () => {
  const revalidate = "public, max-age=0, must-revalidate";
  const immutable = "public, max-age=31536000, immutable";
  const cases = [
    ["/scripts/site.js?v=old", 200, revalidate],
    ["/styles/site.css", 200, revalidate],
    ["/scripts/site-123456789abc.js", 200, immutable],
    ["/scripts/tripadvisor-123456789abc.js", 304, immutable],
    ["/styles/page-123456789abc.css", 200, immutable],
    ["/styles/site-123456789abc.css", 200, immutable],
    ["/robots.txt", 200, revalidate],
    ["/sitemap.xml", 304, revalidate],
    ["/media/_responsive/archive-share-123456789abc.jpg", 200, immutable],
    ["/media/_responsive/2026/09/logo-sttailor-160-123456789abc.webp", 200, immutable],
    ["/media/_responsive/2026/09/logo-sttailor-1000x1024-160-123456789abc.webp", 304, immutable],
    ["/media/_responsive/2026/06/background-hero-trang-lien-he-sttailor-portrait-860-123456789abc.avif", 304, immutable],
    ["/media/_responsive/2026/09/st-tailor-gallery-brocade-dinner-jacket-672-q68-123456789abc.webp", 200, immutable],
    ["/media/_responsive/2026/06/background-hero-trang-lien-he-sttailor-portrait-860.avif", 200, "public, max-age=604800"],
    ["/media/_responsive/2026/09/logo-sttailor-160.webp", 200, "public, max-age=604800"],
    ["/media/archive.webp", 200, "public, max-age=604800"],
    ["/media/missing.webp", 404, "no-store"],
    ["/scripts/site-ffffffffffff.js", 404, "no-store"],
    ["/media/_responsive/missing-share-ffffffffffff.jpg", 503, "no-store"]
  ];
  for (const [asset, status, cacheControl] of cases) {
    const assetEnv = { ASSETS: { fetch: async () => new Response(null, { status, headers: { ETag: '"fixture"' } }) } };
    const response = await worker.fetch(new Request(`https://sttailor.com${asset}`, { method: "HEAD" }), assetEnv);
    assert.equal(response.status, status, asset);
    assert.equal(response.headers.get("Cache-Control"), cacheControl, asset);
    assert.equal(response.headers.get("ETag"), '"fixture"', asset);
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
    ["/product-category/blazer/", "/san-pham/"],
    ["/product-category/trouser/trouser-women/", "/gallery/#album-womenswear"],
    ["/product/mens-formal-blazer-jacket/", "/san-pham/"],
    ["/mens-suits-a-timeless-wardrobe-essential-for-the-modern-gentleman/", "/dich-vu/suit-may-do/"],
    ["/office-suits-a-professional-appearance-that-leads-to-success/", "/dich-vu/suit-may-do/"],
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

test("the Worker serves every public route with its current stylesheet hint", async () => {
  const { routes, routeStyles } = JSON.parse(readFileSync(new URL("../dist/build-manifest.json", import.meta.url), "utf8"));
  assert.ok(routes.length);
  for (const route of routes) {
    const response = await worker.fetch(new Request(new URL(route, "https://sttailor.com")), env);
    assert.equal(response.status, 200, route);
    assert.equal(response.headers.get("Link"), `<${routeStyles[route].href}>; rel=preload; as=style`, route);
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
    assert.equal(response.headers.get("Location"), "https://sttailor.com/cam-nang-may-do/kiem-tra-phom-suit/?utm_source=google&gclid=example", method);
  }
});
