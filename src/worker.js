import buildManifest from "../dist/build-manifest.json" with { type: "json" };
import { indexNowKeyFile } from "./indexnow.js";
import { contentSecurityPolicy, tripadvisorEmbedPath } from "./security-policy.js";
import { fetchFittingFilm, fittingFilm } from "./fitting-film.js";

const canonicalHost = "sttailor.com";
// Serve exactly the canonical routes emitted with the sitemap and page assets.
const routes = new Set(buildManifest.routes);
// Retired WordPress paths have an intentional, permanent destination. Any
// path outside this table and the published routes remains a true 404.
const legacyRoutes = new Map([
  ["/en/", "/"],
  ["/en/gioi-thieu/", "/gioi-thieu/"],
  ["/about/", "/gioi-thieu/"],
  ["/services/", "/dich-vu/"],
  ["/gallery-page/", "/gallery/"],
  ["/product-category/blazer/", "/san-pham/"],
  ["/product-category/trouser/trouser-women/", "/gallery/#album-womenswear"],
  ["/product/mens-formal-blazer-jacket/", "/san-pham/"],
  ["/pricing/", "/bang-gia/"],
  ["/payment/", "/phuong-thuc-thanh-toan/"],
  ["/payment-methods/", "/phuong-thuc-thanh-toan/"],
  ["/contact/", "/lien-he/"],
  ["/tailoring-guide/", "/cam-nang-may-do/"],
  ["/mens-suits-a-timeless-wardrobe-essential-for-the-modern-gentleman/", "/dich-vu/suit-may-do/"],
  ["/office-suits-a-professional-appearance-that-leads-to-success/", "/dich-vu/suit-may-do/"],
  ["/fabric-guide/", "/chon-vai-may-do/"],
  ["/suit-fabrics-the-key-element-that-defines-true-elegance/", "/chon-vai-may-do/"],
  ["/fitting-process/", "/quy-trinh-thu-do/"],
  ["/how-to-choose-the-right-mens-suit-for-your-body-type/", "/cam-nang-may-do/kiem-tra-phom-suit/"],
  ["/alterations/", "/chinh-sua-trang-phuc/"],
  ["/garment-care/", "/bao-quan-giat-la/"],
  ["/10-cach-bao-quan-vest-nam-luon-nhu-moi-bi-quyet-giu-phom-chuan-theo-thoi-gian/", "/bao-quan-giat-la/"],
  ["/refund_returns/", "/doi-tra-hoan-tien/"],
  ["/bao-hanh-sua-chua/", "/dich-vu/"]
]);
const staticPrefixes = ["/media/", "/icons/", "/styles/", "/scripts/", "/fonts/"];
const discoveryFiles = new Set(["/robots.txt", "/sitemap.xml", "/llms.txt"]);
const hourlyFiles = new Set(["/.well-known/security.txt", "/site.webmanifest", `/${indexNowKeyFile}`]);
const staticFiles = new Set([...discoveryFiles, ...hourlyFiles, "/build-manifest.json", "/image-manifest.json"]);
const immutableAssets = [
  /^\/styles\/(?:page|site)-[a-f0-9]{12}\.css$/,
  /^\/scripts\/(?:site|tripadvisor)-[a-f0-9]{12}\.js$/,
  /^\/fonts\/[^/]+-[a-f0-9]{7}\.woff2$/,
  /^\/media\/_responsive\/.+-share-[a-f0-9]{12}\.jpg$/,
  /^\/media\/_responsive\/.+-\d+(?:-q68)?-[a-f0-9]{12}\.(?:avif|webp)$/
];

function securityHeaders(response, pathname = "/") {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Strict-Transport-Security", "max-age=15552000");
  const cacheable = response.ok || response.status === 304;
  if (pathname === "/llms.txt" && cacheable) {
    headers.set("Content-Type", "text/plain; charset=utf-8");
  }
  const contentType = headers.get("Content-Type") || "";
  const isHtml = routes.has(pathname) || pathname.endsWith(".html") || pathname === "/not-found" || contentType.includes("text/html");
  const revalidate = "public, max-age=0, must-revalidate";
  if (isHtml) {
    const isCanonical = routes.has(pathname) && cacheable;
    // Keep per-page Early Hints outside the limited static asset rule table.
    const stylesheet = isCanonical && buildManifest.routeStyles[pathname];
    if (stylesheet) headers.set("Link", `<${stylesheet.href}>; rel=preload; as=style`);
    headers.set("Content-Security-Policy", contentSecurityPolicy(pathname));
    headers.set("X-Robots-Tag", isCanonical ? "index, follow, max-image-preview:large" : "noindex, follow");
  }
  if (response.status >= 400) {
    headers.set("Cache-Control", "no-store");
  } else if (cacheable) {
    if (pathname === tripadvisorEmbedPath) {
      headers.set("Cache-Control", `${revalidate}, no-transform`);
    } else if (isHtml || discoveryFiles.has(pathname)) {
      headers.set("Cache-Control", revalidate);
    } else if (immutableAssets.some((pattern) => pattern.test(pathname))) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (pathname.startsWith("/styles/") || pathname.startsWith("/scripts/") || pathname.startsWith("/fonts/")) {
      headers.set("Cache-Control", revalidate);
    } else if (pathname.startsWith("/media/") || pathname.startsWith("/icons/")) {
      headers.set("Cache-Control", "public, max-age=604800");
    } else if (hourlyFiles.has(pathname)) {
      headers.set("Cache-Control", "public, max-age=3600");
    }
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function notFound(request, env, url) {
  // Cloudflare Assets reserves `/404.html` as a redirect target. The actual
  // document is generated from that source as `/not-found.html` so the worker
  // can return its body while preserving the requested URL and a 404 status.
  // Cloudflare's asset binding canonicalises HTML files to extensionless URLs.
  // Fetch the canonical asset path directly; requesting `/not-found.html`
  // yields a bodyless 307 response and would produce an empty 404 page.
  // Conditions and byte ranges for the original URL do not apply to this page.
  const source = await env.ASSETS.fetch(new Request(new URL("/not-found", url), { method: request.method === "HEAD" ? "HEAD" : "GET" }));
  const headers = new Headers(source.headers);
  headers.delete("Location");
  headers.delete("ETag");
  headers.delete("Last-Modified");
  headers.set("Content-Type", "text/html; charset=utf-8");
  return securityHeaders(new Response(source.body, { status: 404, statusText: "Not Found", headers }), url.pathname);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const requestHost = (request.headers.get("host") || url.hostname).split(":", 1)[0].toLowerCase();

    if (pathname === "/healthz") {
      return Response.json({ ok: true, site: "S.T Tailor", runtime: "Cloudflare Workers" });
    }
    if (pathname === "/wp-login.php" || pathname.startsWith("/wp-admin")) {
      // WordPress was retired. Treat legacy administration endpoints as real,
      // non-indexable missing resources instead of creating a soft 404 redirect.
      return notFound(request, env, url);
    }
    if (requestHost === `www.${canonicalHost}`) {
      url.hostname = canonicalHost;
      return Response.redirect(url, 301);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    // Retired WordPress attachment and WooCommerce AJAX URLs are not pages.
    // Serving the homepage for them creates misleading soft-404 duplicates.
    // Ordinary campaign/query parameters continue to reach the requested page.
    if (url.searchParams.has("attachment_id") || url.searchParams.has("wc-ajax")) {
      return notFound(request, env, url);
    }
    const pathWithSlash = pathname === "/" || pathname.endsWith("/") ? pathname : `${pathname}/`;
    const legacyTarget = legacyRoutes.get(pathWithSlash);
    if (legacyTarget) {
      const destination = new URL(legacyTarget, url);
      destination.search = url.search;
      return Response.redirect(destination, 301);
    }
    if (pathname !== "/" && !pathname.endsWith("/") && routes.has(`${pathname}/`)) {
      return Response.redirect(new URL(`${pathname}/${url.search}`, url), 301);
    }
    if (pathname === fittingFilm.src) {
      return securityHeaders(await fetchFittingFilm(request, env.ASSETS), pathname);
    }
    if (routes.has(pathname) || pathname === tripadvisorEmbedPath || staticFiles.has(pathname) || staticPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return securityHeaders(await env.ASSETS.fetch(request), pathname);
    }
    return notFound(request, env, url);
  }
};
