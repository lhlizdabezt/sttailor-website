const canonicalHost = "sttailor.com";
const routes = new Set([
  "/",
  "/gioi-thieu/",
  "/dich-vu/",
  "/gallery/",
  "/bang-gia/",
  "/phuong-thuc-thanh-toan/",
  "/lien-he/"
]);
// Retired WordPress paths have an intentional, permanent destination. Any
// path outside this table and the published routes remains a true 404.
const legacyRoutes = new Map([
  ["/about/", "/gioi-thieu/"],
  ["/services/", "/dich-vu/"],
  ["/gallery-page/", "/gallery/"],
  ["/pricing/", "/bang-gia/"],
  ["/payment/", "/phuong-thuc-thanh-toan/"],
  ["/payment-methods/", "/phuong-thuc-thanh-toan/"],
  ["/contact/", "/lien-he/"],
  ["/refund_returns/", "/dich-vu/"],
  ["/bao-hanh-sua-chua/", "/dich-vu/"],
  ["/chinh-sach-bao-mat/", "/"],
  ["/dieu-khoan-dieu-kien/", "/"],
  ["/chinh-sach-van-chuyen/", "/"]
]);
const staticPrefixes = ["/media/", "/styles/", "/scripts/"];
const staticFiles = new Set(["/robots.txt", "/sitemap.xml", "/llms.txt", "/site.webmanifest", "/404.html", "/not-found.html", "/_headers", "/build-manifest.json"]);

function securityHeaders(response, pathname = "/") {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Strict-Transport-Security", "max-age=31536000");
  headers.set("Content-Security-Policy", "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests");
  const contentType = headers.get("Content-Type") || "";
  const isHtml = routes.has(pathname) || pathname.endsWith(".html") || pathname === "/not-found" || contentType.includes("text/html");
  if (isHtml) {
    headers.set("X-Robots-Tag", "index, follow, max-image-preview:large");
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  } else if (staticPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (["/robots.txt", "/sitemap.xml", "/llms.txt", "/site.webmanifest"].includes(pathname)) {
    headers.set("Cache-Control", "public, max-age=3600");
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
  const source = await env.ASSETS.fetch(new Request(new URL("/not-found", url), request));
  // The asset binding can include its own fallback Location header. A typo
  // must remain on the requested URL and render the document with a true 404.
  const headers = new Headers(source.headers);
  headers.delete("Location");
  const response = securityHeaders(new Response(source.body, { status: 404, statusText: "Not Found", headers }), url.pathname);
  const notFoundHeaders = new Headers(response.headers);
  notFoundHeaders.set("X-Robots-Tag", "noindex, follow");
  return new Response(response.body, { status: 404, statusText: "Not Found", headers: notFoundHeaders });
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
      return Response.redirect(new URL("/lien-he/", url), 302);
    }
    if (requestHost === `www.${canonicalHost}`) {
      url.hostname = canonicalHost;
      return Response.redirect(url, 301);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const pathWithSlash = pathname === "/" || pathname.endsWith("/") ? pathname : `${pathname}/`;
    const legacyTarget = legacyRoutes.get(pathWithSlash);
    if (legacyTarget) {
      return Response.redirect(new URL(`${legacyTarget}${url.search}`, url), 301);
    }
    if (pathname !== "/" && !pathname.endsWith("/") && routes.has(`${pathname}/`)) {
      return Response.redirect(new URL(`${pathname}/${url.search}`, url), 301);
    }
    if (routes.has(pathname) || staticFiles.has(pathname) || staticPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return securityHeaders(await env.ASSETS.fetch(request), pathname);
    }
    return notFound(request, env, url);
  }
};
