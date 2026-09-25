import { indexNowKey, indexNowKeyFile } from "../src/indexnow.js";

const origin = "https://sttailor.com";
const expectedBuildRevision = process.env.EXPECTED_BUILD_REVISION;
if (expectedBuildRevision && !/^[0-9a-f]{40}$/i.test(expectedBuildRevision)) throw new Error("EXPECTED_BUILD_REVISION must be a full Git commit SHA.");
const routes = [
  "/",
  "/gioi-thieu/",
  "/dich-vu/",
  "/gallery/",
  "/bang-gia/",
  "/phuong-thuc-thanh-toan/",
  "/lien-he/",
  "/cam-nang-may-do/",
  "/chon-vai-may-do/",
  "/quy-trinh-thu-do/",
  "/chinh-sua-trang-phuc/",
  "/bao-quan-giat-la/",
  "/doi-tra-hoan-tien/",
  "/chinh-sach-van-chuyen/",
  "/dieu-khoan-dieu-kien/",
  "/chinh-sach-bao-mat/"
];

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

// Cloudflare may need a short DNS propagation window immediately after a
// custom-domain Worker deployment. Retry transient network failures only;
// status assertions below still fail immediately for an incorrect response.
async function fetchWithRetry(resource, options = {}, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(resource, options);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw lastError;
}

async function fetchUntil(resource, options, predicate, attempts = 20) {
  let lastResponse;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    lastResponse = await fetchWithRetry(resource, options);
    if (predicate(lastResponse)) return lastResponse;
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  return lastResponse;
}

async function fetchTextUntil(resource, options, predicate, attempts = 20) {
  let last;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetchWithRetry(resource, options);
    const text = await response.text();
    last = { response, text };
    if (predicate(response, text)) return last;
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  return last;
}

const pages = new Map();
for (const route of routes) {
  const verifyingRevision = route === "/" && expectedBuildRevision;
  const { response, text: html } = verifyingRevision
    ? await fetchTextUntil(`${origin}${route}`, {}, (candidate, text) => candidate.status === 200 && text.includes(`name="sttailor-build-revision" content="${expectedBuildRevision}"`))
    : { response: await fetchWithRetry(`${origin}${route}`), text: "" };
  const pageHtml = verifyingRevision ? html : await response.text();
  pages.set(route, pageHtml);
  expect(response.status === 200, `${route} returned ${response.status}`);
  expect(response.headers.get("strict-transport-security")?.includes("max-age=15552000"), `${route} has no HSTS policy`);
  expect(response.headers.get("content-security-policy")?.includes("object-src 'none'"), `${route} has no baseline CSP`);
  expect(response.headers.get("x-robots-tag")?.includes("index, follow"), `${route} has no indexable X-Robots-Tag`);
  expect(pageHtml.includes(`<link rel="canonical" href="${origin}${route}">`), `${route} has no production canonical`);
  expect(!pageHtml.toLowerCase().includes("beta.sttailor.com"), `${route} still contains the beta host`);
  expect(pageHtml.includes('name="robots" content="index, follow'), `${route} is not indexable`);
  const footer = pageHtml.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? "";
  const footerLinks = new Set([...footer.matchAll(/\bhref="(\/[^"]*)"/g)].map((match) => match[1]));
  for (const publishedRoute of routes) expect(footerLinks.has(publishedRoute), `${route} footer omits ${publishedRoute}`);
  expect(footer.includes('class="st-footer-v7__bottom st-footer-v8__legal"') && footer.includes('aria-label="Client policies"'), `${route} has no client-policy bar at the footer edge`);
  expect((pageHtml.match(/'GTM-TQSDB6XT'/g) || []).length === 1 && (pageHtml.match(/googletagmanager\.com\/gtm\.js\?id=/g) || []).length === 1 && pageHtml.includes('<head><meta charset="utf-8"><!-- Google Tag Manager -->'), `${route} has no single Google Tag Manager head snippet`);
  expect((pageHtml.match(/googletagmanager\.com\/ns\.html\?id=GTM-TQSDB6XT/g) || []).length === 1 && pageHtml.includes('<body><!-- Google Tag Manager (noscript) -->'), `${route} has no single Google Tag Manager body fallback`);
  expect((pageHtml.match(/g\.src="\/n31x\/"/g) || []).length === 1 && pageHtml.includes('gtag("config","G-BQDKE20XR0")') && !pageHtml.includes('googletagmanager.com/gtag/js'), `${route} has no single first-party Google Analytics 4 tag`);
  expect((pageHtml.match(/clarity\.ms\/tag\//g) || []).length === 0 && pageHtml.includes(')(window,document,"clarity")'), `${route} has a duplicate direct Microsoft Clarity loader or no event queue`);
  expect(!/https:\/\/(?:api\.iconify\.design|cdn\.simpleicons\.org)\//i.test(pageHtml), `${route} still loads third-party icon assets`);
  expect(!pageHtml.includes("data-consent-panel") && !pageHtml.includes("data-consent-open"), `${route} still has a consent control`);
  expect((pageHtml.match(/href="https:\/\/x\.com\/sttalior"/g) || []).length === 1 && pageHtml.includes('"https://x.com/sttalior"'), `${route} has no single official X profile in social links/schema`);
}

if (expectedBuildRevision) expect(pages.get("/").includes(`name="sttailor-build-revision" content="${expectedBuildRevision}"`), "Production did not serve the revision deployed by this workflow.");

const gatewayHealth = await fetchWithRetry(`${origin}/n31x/healthy`);
expect(gatewayHealth.status === 200 && (await gatewayHealth.text()).trim() === "ok", "First-party Google tag gateway health check failed");
const gatewayScript = await fetchWithRetry(`${origin}/n31x/`);
expect(gatewayScript.status === 200 && gatewayScript.headers.get("content-type")?.includes("javascript"), "First-party Google tag script is unavailable");
const gatewayScriptBody = await gatewayScript.text();
expect(gatewayScriptBody.includes("GT-M3SPT65W") && gatewayScriptBody.includes("G-BQDKE20XR0"), "Existing Google tag and GA4 measurement IDs are missing from the first-party gateway");
const tagManagerScript = await fetchWithRetry("https://www.googletagmanager.com/gtm.js?id=GTM-TQSDB6XT");
expect(tagManagerScript.status === 200, "Published GTM container is unavailable");
const tagManagerScriptBody = await tagManagerScript.text();
expect((tagManagerScriptBody.match(/ymcn0kdqo0/g) ?? []).length === 1, "Published GTM container must load the Microsoft Clarity project exactly once");
expect(!tagManagerScriptBody.includes("G-BQDKE20XR0") && !tagManagerScriptBody.includes("GT-M3SPT65W"), "Published GTM container would duplicate the first-party GA4 tag");

const icon = await fetchWithRetry(`${origin}/icons/simple-instagram-e4405f.svg`);
expect(icon.status === 200 && icon.headers.get("content-type")?.includes("image/svg+xml"), "First-party social icons are unavailable");

const home = pages.get("/");
const siteScriptPath = home.match(/<script type="module" src="([^"]+)"/i)?.[1];
const siteScript = siteScriptPath ? await (await fetchWithRetry(new URL(siteScriptPath, origin))).text() : "";
expect(Boolean(siteScriptPath) && siteScript.includes('"contact_click"') && siteScript.includes('"consultation_intent"') && siteScript.includes('"page_type"'), "Production interaction analytics or Clarity page tags are missing");
expect((home.match(/<a class="st-home-editorial__frame/g) || []).length === 5, "Home visual destination cards are missing");
for (const removedHomeRouteText of ["Five ways into the atelier", "Five ways to begin with S.T Tailor", "Năm lối để bước vào không gian atelier", "Năm lối để bắt đầu cùng S.T Tailor", "st-home-v6__routes"]) {
  expect(!home.includes(removedHomeRouteText), `Removed home route strip remains: ${removedHomeRouteText}`);
}
for (const visualDestination of ["/gioi-thieu/", "/dich-vu/", "/gallery/", "/bang-gia/", "/lien-he/", "st-tailor-client-private-consultation.jpg"]) {
  expect(home.includes(visualDestination), `Home visual destination is missing: ${visualDestination}`);
}
expect(home.includes("/media/2026/09/st-tailor-client-fitted-suit.jpg") && !home.includes("/media/2026/09/st-tailor-client-shoulder-fitting.jpg"), "Home FIT card is using the wrong image");
expect(home.includes('rel="manifest" href="/site.webmanifest"'), "Web app manifest discovery is missing");
expect(home.includes('rel="preload" as="image"') && home.includes('fetchpriority="high"'), "Home hero preload is missing");
expect(home.includes('name="twitter:image:alt"'), "Social image alternative text is missing");
expect(home.includes('name="google-site-verification"') && home.includes('name="p:domain_verify"'), "Search ownership metadata is missing");
const cssPath = home.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];
expect(Boolean(cssPath), "The production stylesheet was not found");
const css = cssPath ? await (await fetchWithRetry(new URL(cssPath, origin))).text() : "";
const navigationLinkRule = [...css.matchAll(/\.st-site-nav a[^\{]*\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("text-transform:uppercase"));
const mobileNavigationRule = [...css.matchAll(/\.st-site-nav\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("width:100vw!important"));
const commissionMapRule = [...css.matchAll(/\.st-service-page\s+\.st-service-commission-map\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("margin-top:0!important"));
expect(Boolean(navigationLinkRule), "Navigation is not forced to uppercase");
expect(mobileNavigationRule?.includes("flex-direction:column!important"), "Mobile navigation is not a vertical list");
expect(css.includes(".st-site-header{") && css.includes("background:linear-gradient(110deg,#f4e2c5,#e8cfab 52%,#f6e7cf)"), "Opaque tan header treatment is missing");
expect(Boolean(commissionMapRule), "Services spacing fix is missing");

const contact = pages.get("/lien-he/");
expect(!contact.includes("Tell us what you are dressing for"), "Removed contact introduction is still present");
expect(!contact.includes("Hãy chia sẻ dịp sử dụng"), "Removed Vietnamese contact introduction is still present");
expect(!contact.includes("CONTACT S.T TAILOR / LIÊN HỆ"), "Removed contact hero label is still present");

expect(home.includes('"LocalBusiness"'), "LocalBusiness structured data is missing");
expect(home.includes('"OfferCatalog"'), "OfferCatalog structured data is missing");
expect(home.includes('"SiteNavigationElement"'), "SiteNavigationElement structured data is missing");
expect(pages.get("/dich-vu/").includes('"Service"'), "Services structured data is missing");

const galleryHtml = pages.get("/gallery/");
const galleryImages = [...galleryHtml.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^\"]+)"[^>]*>/gi)]
  .filter((match) => !/(?:logo-sttailor|LinkedInLogo)/i.test(match[1]));
expect(galleryImages.length === 111 && new Set(galleryImages.map((match) => match[1])).size === 111, "Gallery is missing images or repeats an image");
for (const asset of ["st-tailor-made-to-measure-stories-gallery.jpg", "st-tailor-magenta-floral-wrap-dress-and-navy-suit.jpg", "st-tailor-magenta-floral-wrap-dress-full-length.jpg", "st-tailor-magenta-floral-wrap-dress-detail.jpg", "st-tailor-showroom-exterior-evening.jpg"]) {
  const path = `/media/2026/09/${asset}`;
  expect(galleryImages.filter((match) => match[1] === path).length === 1, `Gallery must show ${asset} exactly once`);
  const image = await fetchWithRetry(`${origin}${path}`);
  expect(image.status === 200 && image.headers.get("content-type")?.includes("image/jpeg"), `Gallery image is unavailable: ${asset}`);
}

const robots = await fetchWithRetry(`${origin}/robots.txt`);
const robotsText = await robots.text();
expect(robots.status === 200 && robotsText.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt is invalid");

const llms = await fetchWithRetry(`${origin}/llms.txt`);
const llmsText = await llms.text();
expect(llms.status === 200 && /^# S\.T Tailor$/m.test(llmsText), "llms.txt is missing its Markdown heading");
const llmsUrls = [...llmsText.matchAll(/\[[^\]]+\]\((https:\/\/sttailor\.com\/[^)]*)\)/g)].map((match) => match[1]);
expect(llmsUrls.length === routes.length && new Set(llmsUrls).size === routes.length && routes.every((route) => llmsUrls.includes(`${origin}${route}`)), "llms.txt does not link to all canonical routes");

const indexNowKeyResponse = await fetchWithRetry(`${origin}/${indexNowKeyFile}`);
expect(indexNowKeyResponse.status === 200 && (await indexNowKeyResponse.text()).trim() === indexNowKey, "IndexNow ownership key file is missing or invalid");

const sitemap = await fetchWithRetry(`${origin}/sitemap.xml`);
const sitemapText = await sitemap.text();
expect(sitemap.status === 200, `sitemap.xml returned ${sitemap.status}`);
expect((sitemapText.match(/<url>/g) || []).length === routes.length, `sitemap.xml does not contain exactly ${routes.length} public routes`);
expect(sitemapText.includes("xmlns:image="), "Image sitemap namespace is missing");
expect(sitemapText.includes("<image:image>"), "Image sitemap entries are missing");
expect(sitemapText.includes("<image:title>"), "Image sitemap titles are missing");
const gallerySitemap = sitemapText.match(/<url><loc>https:\/\/sttailor\.com\/gallery\/[\s\S]*?<\/url>/)?.[0] ?? "";
expect((gallerySitemap.match(/<image:image>/g) || []).length === 111, "Gallery sitemap omits one or more editorial images");

const manifest = await fetchWithRetry(`${origin}/site.webmanifest`);
expect(manifest.status === 200 && (await manifest.text()).includes('"name": "S.T Tailor"'), "site.webmanifest is invalid");

const legacy = await fetchWithRetry(`${origin}/about/`, { redirect: "manual" });
expect(legacy.status === 301 && legacy.headers.get("location") === `${origin}/gioi-thieu/`, "Legacy URL mapping is not a 301");
const oldRefund = await fetchWithRetry(`${origin}/refund_returns/`, { redirect: "manual" });
expect(oldRefund.status === 301 && oldRefund.headers.get("location") === `${origin}/doi-tra-hoan-tien/`, "Old returns URL does not redirect to the new policy");

const expectedWwwLocation = `${origin}/gallery/?source=www`;
const www = await fetchUntil(
  "https://www.sttailor.com/gallery/?source=www",
  { redirect: "manual" },
  (response) => response.status === 301 && response.headers.get("location") === expectedWwwLocation
);
expect(www.status === 301 && www.headers.get("location") === `${origin}/gallery/?source=www`, "www does not preserve path/query in its apex 301");
expect(www.headers.get("strict-transport-security")?.includes("max-age=15552000"), "www redirect has no conservative HSTS policy");

const missing = await fetchWithRetry(`${origin}/this-page-does-not-exist`);
const missingHtml = await missing.text();
expect(missing.status === 404, `Unknown URL returned ${missing.status}`);
expect(missingHtml.includes("Back to Home"), "404 page has no Back to Home action");
expect(missing.headers.get("x-robots-tag")?.includes("noindex"), "404 response is not marked noindex");
expect(missingHtml.includes('<meta name="robots" content="noindex, follow">') && !missingHtml.includes('<link rel="canonical"'), "404 HTML has conflicting index or canonical signals");

const retiredWordPress = await fetchWithRetry(`${origin}/wp-login.php`, { redirect: "manual" });
expect(retiredWordPress.status === 404, `Retired WordPress login returned ${retiredWordPress.status} instead of 404`);
expect(retiredWordPress.headers.get("x-robots-tag")?.includes("noindex"), "Retired WordPress login is not marked noindex");

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log("PASS: production routes, mobile navigation, header styling, removals, schema, sitemap, redirects and true 404 verified.");
