import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker.js";

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

test("unmatched retired products retain a true 404 instead of a homepage redirect", async () => {
  const response = await worker.fetch(new Request("https://sttailor.com/product/diamond-necklace/"), env);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Location"), null);
});
