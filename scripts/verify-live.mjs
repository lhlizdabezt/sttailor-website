import { clientCareFailures } from "./client-care-contract.mjs";
import { businessProfileFailures, hasContactIntroduction } from "./business-profile-contract.mjs";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexNowKey, indexNowKeyFile } from "../src/indexnow.js";
import { contentSecurityPolicy, tripadvisorEmbedPath } from "../src/security-policy.js";
import { publicPhotoArchives } from "../src/public-photo-archives.js";

const origin = "https://sttailor.com";
const expectedBuildRevision = process.env.EXPECTED_BUILD_REVISION;
if (expectedBuildRevision && !/^[0-9a-f]{40}$/i.test(expectedBuildRevision)) throw new Error("EXPECTED_BUILD_REVISION must be a full Git commit SHA.");
const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const { routes, indexNowPageSignatures } = JSON.parse(readFileSync(path.join(dist, "build-manifest.json"), "utf8"));

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};
const revalidate = "public, max-age=0, must-revalidate";
const utf8 = new TextDecoder("utf-8", { fatal: true });
const assetTypes = new Map([
  [".avif", "image/avif"], [".css", "text/css"], [".heic", "image/heic"], [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"], [".json", "application/json"], [".mp4", "video/mp4"], [".png", "image/png"],
  [".svg", "image/svg+xml"], [".txt", "text/plain"], [".webp", "image/webp"], [".woff2", "font/woff2"]
]);

async function readUtf8(response, route) {
  try {
    return utf8.decode(await response.arrayBuffer());
  } catch (error) {
    throw new Error(`Could not read a valid UTF-8 response for ${route}`, { cause: error });
  }
}

function pageMain(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
}

// Cloudflare may need a short DNS propagation window immediately after a
// custom-domain Worker deployment. Retry transient network failures only;
// status assertions below still fail immediately for an incorrect response.
async function fetchWithRetry(resource, options = {}, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(resource, { ...options, signal: AbortSignal.timeout(15_000) });
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
    const text = await readUtf8(response, resource);
    last = { response, text };
    if (predicate(response, text)) return last;
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  return last;
}

const pages = new Map();
const pageDates = new Map();
const titles = new Set();
const descriptions = new Set();
for (const route of routes) {
  const verifyingRevision = route === "/" && expectedBuildRevision;
  const { response, text: html } = verifyingRevision
    ? await fetchTextUntil(`${origin}${route}`, { redirect: "manual" }, (candidate, text) => candidate.status === 200 && text.includes(`name="sttailor-build-revision" content="${expectedBuildRevision}"`))
    : { response: await fetchWithRetry(`${origin}${route}`, { redirect: "manual" }), text: "" };
  const pageHtml = verifyingRevision ? html : await readUtf8(response, route);
  pages.set(route, pageHtml);
  const stylesheet = pageHtml.match(/<link rel="stylesheet" href="([^"]+)"/i)?.[1];
  expect(stylesheet && response.headers.get("link")?.includes(`<${stylesheet}>; rel=preload; as=style`), `${route} does not advertise its current stylesheet to Cloudflare Early Hints`);
  expect(pageHtml.includes('<link rel="describedby" href="/llms.txt" type="text/plain">'), `${route} does not advertise its bilingual discovery guide`);
  expect(response.headers.get("content-type")?.toLowerCase() === "text/html; charset=utf-8", `${route} does not declare UTF-8 HTML`);
  expect(response.headers.get("content-language") === "en, vi", `${route} does not declare both audience languages`);
  expect(response.headers.get("cache-control") === revalidate, `${route} does not revalidate its HTML before reuse`);
  expect((pageHtml.match(/<main\b/gi) ?? []).length === 1 && (pageHtml.match(/<\/main>/gi) ?? []).length === 1, `${route} must have exactly one main landmark`);
  expect(pageHtml.includes('<noscript><img height="1" width="1" style="display:none" alt="" aria-hidden="true" src="https://www.facebook.com/tr?id=2294442874726399&amp;ev=PageView&amp;noscript=1"></noscript>') && !/\bfbq\s*\(/.test(pageHtml), `${route} must use GTM Meta Pixel with its static noscript fallback only`);
  expect(response.status === 200, `${route} returned ${response.status}`);
  if (expectedBuildRevision) {
    expect(pageHtml.includes(`name="sttailor-build-revision" content="${expectedBuildRevision}"`), `${route} did not serve the deployed revision ${expectedBuildRevision}`);
  }
  expect(response.headers.get("strict-transport-security")?.includes("max-age=15552000"), `${route} has no HSTS policy`);
  const policy = response.headers.get("content-security-policy") ?? "";
  expect(policy === contentSecurityPolicy(route), `${route} does not enforce the expected CSP`);
  for (const [, attributes, body] of pageHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!body.trim() || /\btype="application\/ld\+json"/i.test(attributes)) continue;
    const hash = createHash("sha256").update(body.replace(/\r\n?/g, "\n")).digest("base64");
    expect(policy.includes(`'sha256-${hash}'`), `${route} has an inline script blocked by CSP: ${hash}`);
  }
  const robotsTag = response.headers.get("x-robots-tag") ?? "";
  expect(robotsTag.startsWith("index, follow") && !/\b(?:noindex|noimageindex|none)\b/i.test(robotsTag), `${route} has no indexable X-Robots-Tag`);
  const canonicals = [...pageHtml.matchAll(/<link rel="canonical" href="([^"]+)">/gi)];
  expect(canonicals.length === 1 && canonicals[0][1] === `${origin}${route}`, `${route} must publish exactly one self-referencing canonical`);
  expect(!pageHtml.toLowerCase().includes("beta.sttailor.com"), `${route} still contains the beta host`);
  const robotDirectives = [...pageHtml.matchAll(/<meta name="(robots|googlebot)" content="([^"]+)">/gi)];
  expect(new Set(robotDirectives.map(([, name]) => name.toLowerCase())).size === 2 && robotDirectives.length === 2 && robotDirectives.every(([, , value]) =>
    value.startsWith("index, follow") && !/\b(?:noindex|noimageindex|none)\b/i.test(value)), `${route} must publish unambiguous indexable robots and Googlebot metadata`);
  const title = pageHtml.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = pageHtml.match(/<meta name="description" content="([^"]+)">/i)?.[1]?.trim();
  expect(title && !titles.has(title), `${route} has a missing or duplicate title`);
  expect(description && !descriptions.has(description), `${route} has a missing or duplicate description`);
  titles.add(title);
  descriptions.add(description);
  expect(pageHtml.includes('"hasOfferCatalog":{"@type":"OfferCatalog"') && !pageHtml.includes('"makesOffer":{"@type":"OfferCatalog"'), `${route} has an invalid LocalBusiness service catalog relationship`);
  const footer = pageHtml.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? "";
  const schemaText = pageHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
  const schemaGraph = schemaText ? JSON.parse(schemaText)["@graph"] : [];
  const pageSchema = schemaGraph.find((entity) => entity["@id"] === `${origin}${route}#webpage`);
  expect(pageSchema?.url === `${origin}${route}` && pageSchema.inLanguage?.includes("en") && pageSchema.inLanguage.includes("vi"), `${route} has inconsistent bilingual WebPage schema`);
  pageDates.set(route, pageSchema?.dateModified);
  for (const failure of businessProfileFailures(footer, schemaGraph)) failures.push(`${failure}: ${route}`);
  const mapFrames = [...pageHtml.replace(/<template\b[\s\S]*?<\/template>/gi, "").matchAll(/<iframe\b[^>]*src="https:\/\/www\.google\.com\/maps\/embed\?[^>]*><\/iframe>/g)];
  const mapInFooter = mapFrames.some(([frame]) => footer.includes(frame));
  expect(mapFrames.length === 1 && !/data-map-(?:load|template|panel)/.test(pageHtml) && mapInFooter === (route !== "/lien-he/"), `${route} must embed one direct Google map without a click-to-display control`);
  expect(footer.includes('class="st-footer-v7__map" href="https://maps.app.goo.gl/'), `${route} has no independent Google Maps directions link`);
  expect(/property="og:image" content="https:\/\/sttailor\.com\/media\/_responsive\/[^"]+-share-[a-f0-9]{12}\.jpg"/.test(pageHtml) && pageHtml.includes('property="og:image:type" content="image/jpeg"'), `${route} has no optimized JPEG social preview`);
  expect(/property="og:image:alt" content="[^"]+ (?:\||\/) [^"]+"/.test(pageHtml), `${route} has no bilingual social image description`);
  const tripadvisorProfile = "https://www.tripadvisor.com/Attraction_Review-g293925-d34701232-Reviews-S_T_Tailor-Ho_Chi_Minh_City.html";
  expect(footer.split(`href="${tripadvisorProfile}"`).length === 2 && !footer.includes("st-footer-v7__tripadvisor") && !footer.includes("socialButtonRate") && !footer.includes("Rate us on Tripadvisor"), `${route} footer has a missing or duplicated Tripadvisor link, or still contains the removed rate widget`);
  const reviewEmbed = [...pageHtml.matchAll(/<iframe\b[^>]*>/g)].filter(([tag]) => tag.includes(`src="${tripadvisorEmbedPath}"`));
  expect(!pageHtml.includes("www.jscache.com/wejs") && reviewEmbed.length === Number(route === "/gioi-thieu/"), `${route} has incorrect Tripadvisor widget placement`);
  if (route === "/gioi-thieu/") expect(reviewEmbed[0]?.[0].includes('loading="lazy"') && reviewEmbed[0][0].includes('sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"') && pageHtml.includes(`class="st-tripadvisor__link" href="${tripadvisorProfile}"`), "About page lost its lazy Tripadvisor badge or direct profile link");
  const footerLinks = new Set([...footer.matchAll(/\bhref="(\/[^"]*)"/g)].map((match) => match[1]));
  for (const publishedRoute of routes) expect(footerLinks.has(publishedRoute), `${route} footer omits ${publishedRoute}`);
  expect(footer.includes('class="st-footer-v7__bottom st-footer-v8__legal"') && footer.includes('aria-label="Client policies"'), `${route} has no client-policy bar at the footer edge`);
  expect((pageHtml.match(/'GTM-TQSDB6XT'/g) || []).length === 1 && (pageHtml.match(/googletagmanager\.com\/gtm\.js\?id=/g) || []).length === 1 && /<head>[^]*?<!-- Google Tag Manager -->[^]*?<\/head>/.test(pageHtml), `${route} has no single Google Tag Manager head snippet`);
  expect((pageHtml.match(/googletagmanager\.com\/ns\.html\?id=GTM-TQSDB6XT/g) || []).length === 1 && pageHtml.includes('<body><!-- Google Tag Manager (noscript) -->'), `${route} has no single Google Tag Manager body fallback`);
  expect((pageHtml.match(/g\.src="\/n31x\/"/g) || []).length === 1 && pageHtml.includes('gtag("config","G-BQDKE20XR0")') && !pageHtml.includes('googletagmanager.com/gtag/js'), `${route} has no single first-party Google Analytics 4 tag`);
  const mainContent = pageMain(pageHtml);
  expect(/\blang="vi"/.test(mainContent), `${route} has no Vietnamese language marking in its rendered source`);
  expect(!/in writing|written quotation|bằng văn bản/i.test(mainContent), `${route} still uses rigid written-confirmation wording`);
  expect(!/PayPal|\bWise\b/i.test(pageHtml), `${route} still lists removed international payment wallets in content or metadata`);
  expect((pageHtml.match(/clarity\.ms\/tag\//g) || []).length === 0 && pageHtml.includes(')(window,document,"clarity")'), `${route} has a duplicate direct Microsoft Clarity loader or no event queue`);
  expect(!/https:\/\/(?:api\.iconify\.design|cdn\.simpleicons\.org)\//i.test(pageHtml), `${route} still loads third-party icon assets`);
  expect(!pageHtml.includes("data-consent-panel") && !pageHtml.includes("data-consent-open"), `${route} still has a consent control`);
  expect(!/https?:\/\/(?:[a-z0-9-]+\.)*(?:x|twitter)\.com(?:[\/:?"\s]|$)|name=["']twitter:/i.test(pageHtml), `${route} still contains a retired social integration`);
  expect((pageHtml.match(/href="https:\/\/www\.threads\.com\/@sttailorhcm"/g) || []).length === 1 && pageHtml.includes('"https://www.threads.com/@sttailorhcm"'), `${route} has no single official Threads profile in social links/schema`);
}

const reviewWidget = await fetchWithRetry(`${origin}${tripadvisorEmbedPath}`);
const reviewWidgetHtml = await reviewWidget.text();
expect(reviewWidget.status === 200 && reviewWidget.headers.get("x-robots-tag") === "noindex, follow" && reviewWidget.headers.get("content-security-policy") === contentSecurityPolicy(tripadvisorEmbedPath), "Tripadvisor embed headers are incorrect");
expect(reviewWidgetHtml.includes('id="TA_selfserveprop383"') && reviewWidgetHtml.includes("wejs?wtype=selfserveprop") && reviewWidgetHtml.includes("&amp;nreviews=2") && reviewWidgetHtml.includes('class="st-tripadvisor__fallback"'), "Tripadvisor embed lost the official review snippets or fallback");

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
expect((tagManagerScriptBody.match(/2294442874726399/g) ?? []).length === 1 && tagManagerScriptBody.includes("connect.facebook.net/en_US/fbevents.js"), "Published GTM container must contain the approved Meta Pixel exactly once");
expect(tagManagerScriptBody.includes('"arg1":"^(gtm|gtag)\\\\."'), "Published GTM must exclude internal gtm/gtag events from Meta custom-event tracking");

const icon = await fetchWithRetry(`${origin}/icons/simple-instagram-e4405f.svg`);
expect(icon.status === 200 && icon.headers.get("content-type")?.includes("image/svg+xml"), "First-party social icons are unavailable");

const home = pages.get("/");
const siteScriptPath = home.match(/<script type="module" src="([^"]+)"/i)?.[1];
const siteScriptResponse = siteScriptPath ? await fetchWithRetry(new URL(siteScriptPath, origin)) : null;
const siteScript = siteScriptResponse ? await siteScriptResponse.text() : "";
const siteScriptVersion = createHash("sha256").update(siteScript).digest("hex").slice(0, 12);
expect(siteScriptResponse?.status === 200 && siteScriptPath === `/scripts/site-${siteScriptVersion}.js`, "The published site script is unavailable or its filename fingerprint is incorrect");
expect(siteScriptResponse?.headers.get("cache-control")?.includes("immutable"), "The fingerprinted site script has no immutable caching");
expect(Boolean(siteScriptPath) && siteScript.includes('"contact_click"') && siteScript.includes('"consultation_intent"') && siteScript.includes('"page_type"'), "Production interaction analytics or Clarity page tags are missing");
expect(
  (home.match(/<article class="st-home-editorial__frame">/g) ?? []).length === 5 &&
    (home.match(/<a class="st-home-editorial__link"[^>]*aria-describedby="/g) ?? []).length === 5,
  "Home visual destination cards or their accessible links are missing"
);
for (const removedHomeRouteText of ["Five ways into the atelier", "Five ways to begin with S.T Tailor", "Năm lối để bước vào không gian atelier", "Năm lối để bắt đầu cùng S.T Tailor", "st-home-v6__routes"]) {
  expect(!home.includes(removedHomeRouteText), `Removed home route strip remains: ${removedHomeRouteText}`);
}
for (const visualDestination of ["/gioi-thieu/", "/dich-vu/", "/gallery/", "/bang-gia/", "/lien-he/", "st-tailor-client-private-consultation.jpg"]) {
  expect(home.includes(visualDestination), `Home visual destination is missing: ${visualDestination}`);
}
expect(home.includes("/media/2026/09/st-tailor-client-fitted-suit.jpg") && !home.includes("/media/2026/09/st-tailor-client-shoulder-fitting.jpg"), "Home FIT card is using the wrong image");
expect(home.includes('rel="manifest" href="/site.webmanifest"'), "Web app manifest discovery is missing");
expect(home.includes('rel="icon" href="/icons/sttailor-favicon-48.png"') && home.includes('rel="apple-touch-icon" href="/icons/sttailor-apple-touch-180.png"'), "Compact brand icons are missing from the live page");
expect(home.includes('rel="preload" as="image"') && home.includes('fetchpriority="high"'), "Home hero preload is missing");
expect(home.includes('property="og:image:alt"'), "Social image alternative text is missing");
expect(home.includes('name="google-site-verification"') && home.includes('name="p:domain_verify"'), "Search ownership metadata is missing");
const cssPath = home.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];
expect(Boolean(cssPath), "The production stylesheet was not found");
const stylesheets = new Map();
for (const [route, pageHtml] of pages) {
  const hrefs = [...pageHtml.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
  expect(hrefs.length === 1 && /^\/styles\/page-[a-f0-9]{12}\.css$/.test(hrefs[0] ?? ""), `${route} has no single content-addressed page stylesheet`);
  const href = hrefs[0];
  if (href && !stylesheets.has(href)) {
    const response = await fetchWithRetry(new URL(href, origin));
    expect(response.status === 200 && response.headers.get("content-type")?.includes("text/css"), `${route} stylesheet is unavailable`);
    expect(response.headers.get("cache-control")?.includes("immutable"), `${route} stylesheet has no immutable caching`);
    const stylesheetText = await response.text();
    const stylesheetHash = createHash("sha256").update(stylesheetText).digest("hex").slice(0, 12);
    expect(href === `/styles/page-${stylesheetHash}.css`, `${route} stylesheet content does not match its cache-safe filename`);
    stylesheets.set(href, stylesheetText);
  }
}
const css = stylesheets.get(cssPath) ?? "";
const navigationLinkRule = [...css.matchAll(/\.st-site-nav a[^\{]*\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("text-transform:uppercase"));
const mobileNavigationRule = [...css.matchAll(/\.st-site-nav\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("width:100vw!important"));
const servicesCssPath = pages.get("/dich-vu/").match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];
const servicesCss = stylesheets.get(servicesCssPath) ?? "";
const commissionMapRule = [...servicesCss.matchAll(/\.st-service-page\s+\.st-service-commission-map\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("margin-top:0!important"));
expect(navigationLinkRule?.includes("border:0") && navigationLinkRule.includes("background:0 0"), "Primary navigation links are missing the transparent, borderless treatment");
expect(mobileNavigationRule?.includes("flex-direction:column!important"), "Mobile navigation is not a vertical list");
expect(css.includes(".st-site-header{") && css.includes("background:linear-gradient(110deg,#f4e2c5,#e8cfab 52%,#f6e7cf)"), "Opaque tan header treatment is missing");
expect(Boolean(commissionMapRule), "Services spacing fix is missing");

const contact = pages.get("/lien-he/");
expect(contact.includes("1st Floor, 258 Le Thanh Ton, Tan Dinh Ward"), "Contact page does not display the confirmed showroom floor and ward");
expect(!contact.includes("Tầng 1, 258 Lê Thánh Tôn"), "Contact page still mixes Vietnamese into a single-language address");
for (const policyRoute of ["/doi-tra-hoan-tien/", "/chinh-sach-bao-mat/", "/dieu-khoan-dieu-kien/", "/chinh-sach-van-chuyen/"]) {
  for (const issue of clientCareFailures(pages.get(policyRoute))) expect(false, `${policyRoute}: ${issue}`);
}
for (const issue of clientCareFailures(pages.get("/phuong-thuc-thanh-toan/"), true)) expect(false, `Payment: ${issue}`);
expect(pages.get("/chinh-sach-van-chuyen/").includes("Lầu 1, 258 Lê Thánh Tôn, Phường Tân Định"), "Shipping collection address is missing its approved Vietnamese wording");
expect(pages.get("/gioi-thieu/").includes("1st Floor, 258 Le Thanh Ton, Tan Dinh Ward"), "About page does not display the confirmed showroom floor");
expect(home.includes("1st Floor, 258 Le Thanh Ton, Tan Dinh Ward"), "Shared footer does not display the confirmed showroom floor and ward");
expect(!contact.includes("Tell us what you are dressing for"), "Removed contact introduction is still present");
expect(!contact.includes("Hãy chia sẻ dịp sử dụng"), "Removed Vietnamese contact introduction is still present");
expect(!contact.includes("CONTACT S.T TAILOR / LIÊN HỆ"), "Removed contact hero label is still present");
expect(hasContactIntroduction(contact), "Contact must place its bilingual consultation guidance above the address and map columns");

expect(home.includes('"LocalBusiness"'), "LocalBusiness structured data is missing");
expect(home.includes('"OfferCatalog"'), "OfferCatalog structured data is missing");
expect(home.includes('"SiteNavigationElement"'), "SiteNavigationElement structured data is missing");
expect(pages.get("/dich-vu/").includes('"Service"'), "Services structured data is missing");

const galleryHtml = pages.get("/gallery/");
const filmPath = "/media/2026/09/st-tailor-womenswear-fitting-film.mp4";
const posterPath = "/media/2026/09/st-tailor-womenswear-fitting-poster.webp";
const filmTag = galleryHtml.match(/<video\b[^>]*>[\s\S]*?<\/video>/i)?.[0] ?? "";
expect((galleryHtml.match(/<video\b/gi) || []).length === 1 && /\bcontrols\b/.test(filmTag) && /\bpreload="none"/.test(filmTag) && !/\bautoplay\b/.test(filmTag) && filmTag.includes(`poster="${posterPath}"`) && filmTag.includes(`src="${filmPath}"`), "Gallery fitting film is missing or loads without user intent");
const watchHtml = pages.get("/phim-thu-do/");
expect(galleryHtml.includes('href="/phim-thu-do/"') && !galleryHtml.includes('"@type":"VideoObject"') && watchHtml.includes('"@type":"VideoObject"') && watchHtml.includes(`"contentUrl":"${origin}${filmPath}"`) && watchHtml.includes(`src="${filmPath}"`), "Fitting watch page, VideoObject or Gallery link is missing");
function galleryImagePaths(html) {
  return [...html.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^"]+)"[^>]*>/gi)]
    .map((match) => match[1])
    .filter((src) => !/(?:logo-sttailor|LinkedInLogo)/i.test(src));
}

// The build check compares this document against the approved source images.
// Compare the deployed document with the checked build for this release.
const builtGalleryImages = new Set(galleryImagePaths(readFileSync(path.join(dist, "gallery", "index.html"), "utf8")));
const galleryImages = galleryImagePaths(galleryHtml);
const liveGalleryImages = new Set(galleryImages);
expect(builtGalleryImages.size > 0, "The built Gallery has no editorial images");
expect(liveGalleryImages.size === galleryImages.length, "The live Gallery repeats an editorial image");
for (const src of builtGalleryImages) expect(liveGalleryImages.has(src), `The live Gallery is missing ${src}`);
for (const src of liveGalleryImages) expect(builtGalleryImages.has(src), `The live Gallery contains an unexpected image: ${src}`);
for (const asset of ["st-tailor-made-to-measure-stories-gallery.jpg", "st-tailor-magenta-floral-wrap-dress-and-navy-suit.jpg", "st-tailor-magenta-floral-wrap-dress-full-length.jpg", "st-tailor-magenta-floral-wrap-dress-detail.jpg", "st-tailor-showroom-exterior-evening.jpg"]) {
  const path = `/media/2026/09/${asset}`;
  expect(liveGalleryImages.has(path), `Gallery must show ${asset}`);
  const image = await fetchWithRetry(`${origin}${path}`);
  expect(image.status === 200 && image.headers.get("content-type")?.includes("image/jpeg"), `Gallery image is unavailable: ${asset}`);
}
const film = await fetchWithRetry(`${origin}${filmPath}`, { method: "HEAD" });
expect(film.status === 200 && film.headers.get("content-type")?.includes("video/mp4") && film.headers.get("accept-ranges") === "bytes", "Gallery fitting film is unavailable or does not advertise byte ranges");
const filmSample = await fetchWithRetry(`${origin}${filmPath}`, { headers: { Range: "bytes=0-1" } });
expect(filmSample.status === 206 && /^bytes 0-1\/\d+$/.test(filmSample.headers.get("content-range") ?? "") &&
  (await filmSample.arrayBuffer()).byteLength === 2, "Gallery fitting film does not serve partial requests for seeking and Safari playback");
const poster = await fetchWithRetry(`${origin}${posterPath}`, { method: "HEAD" });
expect(poster.status === 200 && poster.headers.get("content-type")?.includes("image/webp"), "Gallery fitting poster is unavailable");

const robots = await fetchWithRetry(`${origin}/robots.txt`, { redirect: "manual" });
const robotsText = await readUtf8(robots, "/robots.txt");
const disclosure = await fetchWithRetry(`${origin}/.well-known/security.txt`);
const disclosureText = await disclosure.text();
expect(disclosure.status === 200 && disclosure.headers.get("content-type")?.includes("text/plain") && disclosureText.includes("Contact: mailto:contact.sttailor@gmail.com") && Date.parse(disclosureText.match(/^Expires: (.+)$/m)?.[1] ?? "") > Date.now(), "security.txt must publish a current vulnerability-reporting contact as plain text");
expect(robots.status === 200 && robots.headers.get("content-type")?.startsWith("text/plain") && robotsText.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt is invalid");
expect(robots.headers.get("cache-control") === revalidate, "robots.txt does not revalidate before reuse");
expect(/^User-agent:\s*\*\s*$/mi.test(robotsText) && /^Allow:\s*\/\s*$/mi.test(robotsText) && !/^Disallow:\s*\/\s*$/mi.test(robotsText), "robots.txt must allow public pages to be crawled");
expect(!/^Disallow:\s*\S+/mi.test(robotsText), "robots.txt must not block a published public resource");

// Inspect every shipped image derivative, icon, font, stylesheet and script, rather
// than inferring accessibility from a few sampled gallery images.
const publicAssets = readdirSync(dist, { recursive: true })
  .filter((file) => /^(media|icons|fonts|styles|scripts)[\\/]/.test(file) && statSync(path.join(dist, file)).isFile())
  .map((file) => `/${file.replaceAll("\\", "/")}`);
publicAssets.push("/build-manifest.json", "/image-manifest.json", "/n31x/");
let assetCursor = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (assetCursor < publicAssets.length) {
    const asset = publicAssets[assetCursor++];
    try {
      const sourcePhoto = publicPhotoArchives.has(asset);
      expect(!asset.startsWith("/media/sources/") || sourcePhoto, `Unapproved photo archive in the build: ${asset}`);
      const response = await fetchWithRetry(`${origin}${asset}`, { method: sourcePhoto ? "GET" : "HEAD", redirect: "manual" }, 2);
      expect(response.status === 200, `Public asset ${asset} returned ${response.status}`);
      const robotsTag = response.headers.get("x-robots-tag") ?? "";
      const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
      const extension = path.extname(asset).toLowerCase();
      const expectedType = assetTypes.get(extension);
      const isJavascript = extension === ".js" || asset === "/n31x/";
      const validType = isJavascript
        ? /^(?:application|text)\/javascript$/.test(contentType ?? "")
        : contentType && contentType !== "text/html" && (!expectedType || contentType === expectedType);
      expect(validType, `Public asset ${asset} returned the wrong content type: ${contentType ?? "missing"}`);
      if (sourcePhoto) {
        expect(robotsTag === "noindex" && contentType === "image/heic", `Source photo ${asset} must serve as a HEIC download excluded from indexing`);
        const releasePhoto = readFileSync(path.join(dist, asset.slice(1)));
        expect(Buffer.from(await response.arrayBuffer()).equals(releasePhoto), `Source photo ${asset} differs from the release file`);
        continue;
      }
      expect(!/\b(?:noindex|none|noimageindex)\b/i.test(robotsTag), `Public asset ${asset} has an indexing restriction`);
      if (/-share-[a-f0-9]{12}\.jpg$/.test(asset)) {
        expect(response.headers.get("content-type")?.includes("image/jpeg") && response.headers.get("cache-control")?.includes("immutable"), `Social preview ${asset} must serve as a cacheable JPEG`);
      }
      const responsiveFormat = asset.match(/^\/media\/_responsive\/.+-\d+(?:-q68)?-[a-f0-9]{12}\.(avif|webp)$/)?.[1];
      if (responsiveFormat) {
        expect(contentType === `image/${responsiveFormat}` && response.headers.get("cache-control")?.includes("immutable"), `Responsive image ${asset} must serve with its ${responsiveFormat} type and immutable caching`);
      }
      if (extension === ".webp" && !responsiveFormat) {
        const cache = response.headers.get("cache-control") ?? "";
        expect(/\bmax-age=604800\b/.test(cache) && !/\bimmutable\b/.test(cache), `Stable WebP ${asset} must expire after seven days`);
      }
      if (asset.endsWith(".woff2")) {
        expect(response.headers.get("content-type") === "font/woff2" && response.headers.get("cache-control")?.includes("immutable"), `Vietnamese font ${asset} must serve as a cacheable WOFF2`);
      }
      if (/^\/(?:scripts|styles)\/.*-[a-f0-9]{12}\.(?:css|js)$/.test(asset)) {
        expect(response.headers.get("cache-control")?.includes("immutable"), `Fingerprinted asset ${asset} has no immutable caching`);
      }
    } catch {
      failures.push(`Public asset ${asset} could not be reached after retry`);
    }
  }
}));
console.log(`Audited ${publicAssets.length} public assets: originals, responsive images, icons, CSS, JavaScript, public build metadata and the first-party measurement gateway.`);
for (const asset of ["/media/sources/2026/11/unpublished.heic", "/media/%73ources/2026/11/unpublished.pdf"]) {
  const response = await fetchWithRetry(`${origin}${asset}`, { method: "HEAD", redirect: "manual" });
  expect(response.status === 404 && response.headers.get("cache-control") === "no-store" && response.headers.get("x-robots-tag") === "noindex, follow",
    `Unapproved photo archive path did not return a non-indexable 404: ${asset}`);
}

const imageBot = await fetchWithRetry(`${origin}/media/2026/09/st-tailor-archive-navy-coastal-suit.jpg`,
  { method: "HEAD", redirect: "manual", headers: { "User-Agent": "Googlebot-Image/1.0" } });
expect(imageBot.status === 200 && imageBot.headers.get("content-type")?.startsWith("image/") && !/\b(?:noindex|noimageindex)\b/i.test(imageBot.headers.get("x-robots-tag") ?? ""), "Googlebot-Image could not reach the canonical archive image");
const legacyArchive = await fetchWithRetry(`${origin}/media/_responsive/2026/09/st-tailor-archive-atelier-one-360.webp`, { method: "HEAD", redirect: "manual" });
expect(legacyArchive.status === 301 && legacyArchive.headers.get("location") === `${origin}/media/_responsive/2026/09/st-tailor-archive-navy-coastal-suit-360.webp`, "The retired archive derivative URL does not redirect to its replacement");
for (const asset of ["2026/06/store-sttailor-1.webp", "2026/09/logo-sttailor.png"]) {
  const original = await fetchWithRetry(`${origin}/wp-content/uploads/${asset}?source=legacy`, { method: "HEAD", redirect: "manual" });
  expect(original.status === 301 && original.headers.get("location") === `${origin}/media/${asset}?source=legacy`, `The former upload for ${asset} does not redirect to its published original`);
}
const unknownUpload = await fetchWithRetry(`${origin}/wp-content/uploads/2026/06/nonexistent-original.webp`, { method: "HEAD", redirect: "manual" });
expect(unknownUpload.status === 404 && !unknownUpload.headers.get("location") && unknownUpload.headers.get("x-robots-tag") === "noindex, follow", "An unknown legacy upload must return a true, non-indexable 404");

const expectedLlms = readFileSync(path.join(dist, "llms.txt"), "utf8");
const discoveryRequest = { redirect: "manual", headers: { "Cache-Control": "no-cache" } };
const { response: llms, text: llmsText } = await fetchTextUntil(`${origin}/llms.txt`, discoveryRequest,
  (candidate, text) => candidate.ok && text === expectedLlms, expectedBuildRevision ? 20 : 1);
expect(llms.status === 200 && /^# S\.T Tailor$/m.test(llmsText), "llms.txt is missing its Markdown heading");
expect(llms.headers.get("cache-control") === revalidate, "llms.txt does not revalidate before reuse");
expect(llms.headers.get("content-language") === "en, vi", "llms.txt does not declare both audience languages");
expect(llms.headers.get("content-type")?.toLowerCase() === "text/plain; charset=utf-8" && llmsText === llmsText.normalize("NFC") && llmsText.includes("Địa chỉ: Lầu 1, 258 Lê Thánh Tôn, Phường Tân Định") && !/\uFFFD|á[º»]|Ã[\u0080-\u00BF]/.test(llmsText), "llms.txt does not serve clean, explicitly declared UTF-8 Vietnamese text");
expect(llmsText === expectedLlms, "Production llms.txt differs from the verified release file");

const indexNowKeyResponse = await fetchWithRetry(`${origin}/${indexNowKeyFile}`);
expect(indexNowKeyResponse.status === 200 && (await indexNowKeyResponse.text()).trim() === indexNowKey, "IndexNow ownership key file is missing or invalid");
const manifestResponse = await fetchWithRetry(`${origin}/build-manifest.json`);
const liveManifest = manifestResponse.ok ? await manifestResponse.json() : {};
expect(manifestResponse.ok && (!expectedBuildRevision || liveManifest.revision === expectedBuildRevision) &&
  Object.keys(liveManifest.indexNowPageSignatures ?? {}).length === routes.length &&
  routes.every((route) => liveManifest.indexNowPageSignatures?.[route] === indexNowPageSignatures?.[route]),
  "Production does not serve the expected IndexNow release signatures");

const expectedSitemap = expectedBuildRevision ? readFileSync(path.join(dist, "sitemap.xml"), "utf8") : null;
// The edge may serve the previous sitemap briefly after the HTML has updated.
const { response: sitemap, text: sitemapText } = await fetchTextUntil(`${origin}/sitemap.xml`, discoveryRequest,
  (candidate, text) => candidate.ok && (!expectedSitemap || text === expectedSitemap), expectedSitemap ? 20 : 1);
expect(sitemap.status === 200 && sitemap.headers.get("content-type")?.includes("xml"), `sitemap.xml returned ${sitemap.status} without XML delivery`);
expect(sitemap.headers.get("cache-control") === revalidate, "sitemap.xml does not revalidate before reuse");
if (expectedSitemap) expect(sitemapText === expectedSitemap, "Production sitemap differs from the validated release artifact");
const sitemapEntries = [...sitemapText.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)];
const sitemapDates = new Map(sitemapEntries.map(([, location, date]) => [location, date]));
expect(sitemapEntries.length === routes.length && sitemapDates.size === routes.length && routes.every((route) => sitemapDates.has(`${origin}${route}`)), "Production sitemap must list every canonical route with a lastmod date exactly once");
for (const [route, pageDate] of pageDates) {
  expect(pageDate && pageDate === sitemapDates.get(`${origin}${route}`), `${route} disagrees with its sitemap lastmod date`);
}
expect(sitemapText.includes("xmlns:image="), "Image sitemap namespace is missing");
expect(sitemapText.includes("<image:image>"), "Image sitemap entries are missing");
expect(!sitemapText.includes("/media/sources/"), "Image sitemap exposes an original archive download");
const gallerySitemap = sitemapText.match(/<url><loc>https:\/\/sttailor\.com\/gallery\/[\s\S]*?<\/url>/)?.[0] ?? "";
const gallerySitemapImages = [...gallerySitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1]);
expect(gallerySitemapImages.length === builtGalleryImages.size && [...builtGalleryImages].every((src) => gallerySitemapImages.includes(`${origin}${src}`)), "Gallery sitemap must contain every editorial image in the build exactly once");
const watchSitemap = sitemapText.match(/<url><loc>https:\/\/sttailor\.com\/phim-thu-do\/[\s\S]*?<\/url>/)?.[0] ?? "";
expect(sitemapText.includes('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"') && (sitemapText.match(/<video:video>/g) || []).length === 1 && watchSitemap.includes(`<video:content_loc>${origin}${filmPath}</video:content_loc>`) && watchSitemap.includes(`<video:thumbnail_loc>${origin}${posterPath}</video:thumbnail_loc>`), "Video sitemap omits or duplicates the fitting watch page");

// User-agent simulations catch broad edge rules. They do not verify crawler IPs.
const crawlerAgents = new Map([
  ["Googlebot Smartphone", "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"],
  ...["Googlebot", "bingbot", "Applebot", "OAI-SearchBot", "GPTBot", "ChatGPT-User", "Claude-SearchBot", "ClaudeBot", "Claude-User", "PerplexityBot", "Perplexity-User"].map((agent) => [agent, agent])
]);
const crawlerRoutes = ["/", "/gallery/", "/lien-he/", "/du-an/nina-campos/", "/san-pham/suit-xam-nhat-ve-chu-k/", "/cam-nang-may-do/"];
const discoveryResources = [["/robots.txt", robotsText], ["/sitemap.xml", sitemapText], ["/llms.txt", llmsText]];
await Promise.all(Array.from(crawlerAgents, async ([agent, userAgent]) => {
  const options = { redirect: "manual", headers: { "User-Agent": userAgent, "Cache-Control": "no-cache" } };
  for (const route of crawlerRoutes) {
    const response = await fetchWithRetry(`${origin}${route}`, options);
    const html = await readUtf8(response, `${agent} ${route}`);
    const robotsTag = response.headers.get("x-robots-tag") ?? "";
    const main = pageMain(html);
    expect(response.status === 200 && robotsTag.startsWith("index, follow") && !/\b(?:noindex|noimageindex|none)\b/i.test(robotsTag) && html.includes(`<link rel="canonical" href="${origin}${route}">`) && main && main === pageMain(pages.get(route) ?? ""), `${agent} cannot read the same canonical bilingual content for ${route}`);
  }
  for (const [route, expectedContent] of discoveryResources) {
    const response = await fetchWithRetry(`${origin}${route}`, options);
    const body = await readUtf8(response, `${agent} ${route}`);
    expect(response.status === 200 && body === expectedContent, `${agent} cannot read the current public ${route}`);
  }
}));
console.log(`Checked ${crawlerAgents.size} crawler user agents across ${crawlerRoutes.length} canonical bilingual pages and ${discoveryResources.length} discovery resources.`);

const manifest = await fetchWithRetry(`${origin}/site.webmanifest`);
expect(manifest.status === 200 && (await manifest.text()).includes('"name": "S.T Tailor"'), "site.webmanifest is invalid");
for (const [icon, limit] of [["sttailor-favicon-48.png", 5000], ["sttailor-apple-touch-180.png", 25000], ["sttailor-app-192.png", 25000], ["sttailor-app-large-512.png", 100000]]) {
  const response = await fetchWithRetry(`${origin}/icons/${icon}`);
  expect(response.status === 200 && (await response.arrayBuffer()).byteLength <= limit, `Compact brand icon is missing or too large: ${icon}`);
}

const legacy = await fetchWithRetry(`${origin}/about/`, { redirect: "manual" });
expect(legacy.status === 301 && legacy.headers.get("location") === `${origin}/gioi-thieu/`, "Legacy URL mapping is not a 301");
const legacyBlazer = await fetchWithRetry(`${origin}/product-category/blazer/`, { redirect: "manual" });
expect(legacyBlazer.status === 301 && legacyBlazer.headers.get("location") === `${origin}/san-pham/`, "Legacy blazer category does not reach the garment showcase");
const restoredBlazer = await fetchWithRetry(`${origin}/san-pham/blazer-mau-be/`, { redirect: "manual" });
expect(restoredBlazer.status === 200, "The original beige blazer URL does not serve its dedicated showcase");
const oldEnglishHome = await fetchWithRetry(`${origin}/en/`, { redirect: "manual" });
const oldEnglishAbout = await fetchWithRetry(`${origin}/en/gioi-thieu/`, { redirect: "manual" });
expect(oldEnglishAbout.status === 301 && oldEnglishAbout.headers.get("location") === `${origin}/gioi-thieu/`, "Bing AI's old English About URL does not redirect to the current About page");
expect(oldEnglishHome.status === 301 && oldEnglishHome.headers.get("location") === `${origin}/`, "Old English homepage does not redirect to the bilingual homepage");
const oldFabricArticle = await fetchWithRetry(`${origin}/suit-fabrics-the-key-element-that-defines-true-elegance/`, { redirect: "manual" });
expect(oldFabricArticle.status === 301 && oldFabricArticle.headers.get("location") === `${origin}/chon-vai-may-do/`, "Old suit-fabrics article does not redirect to the cloth guide");
const oldRefund = await fetchWithRetry(`${origin}/refund_returns/`, { redirect: "manual" });
expect(oldRefund.status === 301 && oldRefund.headers.get("location") === `${origin}/doi-tra-hoan-tien/`, "Old returns URL does not redirect to the new policy");
const oldSuitCare = await fetchWithRetry(`${origin}/10-cach-bao-quan-vest-nam-luon-nhu-moi-bi-quyet-giu-phom-chuan-theo-thoi-gian/?utm_source=bing`, { redirect: "manual" });
expect(oldSuitCare.status === 301 && oldSuitCare.headers.get("location") === `${origin}/bao-quan-giat-la/?utm_source=bing`, "Bing's retired suit-care article does not redirect to the garment-care guide with attribution intact");
const oldBodyFit = await fetchWithRetry(`${origin}/how-to-choose-the-right-mens-suit-for-your-body-type/?utm_source=google&gclid=example`, { redirect: "manual" });
expect(oldBodyFit.status === 301 && oldBodyFit.headers.get("location") === `${origin}/cam-nang-may-do/kiem-tra-phom-suit/?utm_source=google&gclid=example`, "Search Console's retired body-fit article does not redirect to the suit fitting checklist with attribution intact");

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
expect(missing.headers.get("cache-control") === "no-store", "A page miss can enter the browser cache");
expect(missingHtml.includes("Back to Home"), "404 page has no Back to Home action");
expect(missing.headers.get("x-robots-tag")?.includes("noindex"), "404 response is not marked noindex");
expect(missingHtml.includes('<meta name="robots" content="noindex, follow">') && !missingHtml.includes('<link rel="canonical"'), "404 HTML has conflicting index or canonical signals");

for (const asset of ["/styles/site.css", "/scripts/site.js", "/scripts/tripadvisor.js"]) {
  const alias = await fetchWithRetry(`${origin}${asset}`, { method: "HEAD" });
  expect(alias.status === 200 && alias.headers.get("cache-control") === revalidate, `Stable asset alias ${asset} does not revalidate before reuse`);
}
for (const asset of ["/styles/page-000000000000.css", "/scripts/site-000000000000.js", "/media/sttailor-missing-test.webp"]) {
  const miss = await fetchWithRetry(`${origin}${asset}`, { method: "HEAD" });
  expect(miss.status === 404 && miss.headers.get("cache-control") === "no-store", `Asset miss ${asset} can enter the browser cache`);
}

for (const internalPath of ["/404.html", "/404", "/not-found.html", "/not-found", "/_headers"]) {
  const response = await fetchWithRetry(`${origin}${internalPath}`, { redirect: "manual" });
  const html = await response.text();
  expect(response.status === 404 && !response.headers.has("location") && response.headers.get("x-robots-tag") === "noindex, follow" && html.includes("Back to Home"), `Internal build path ${internalPath} is not a true, non-indexable 404`);
}

const retiredWordPress = await fetchWithRetry(`${origin}/wp-login.php`, { redirect: "manual" });
expect(retiredWordPress.status === 404, `Retired WordPress login returned ${retiredWordPress.status} instead of 404`);
expect(retiredWordPress.headers.get("x-robots-tag")?.includes("noindex"), "Retired WordPress login is not marked noindex");

for (const query of ["attachment_id=3263", "wc-ajax=%25%25endpoint%25%25"]) {
  const retired = await fetchWithRetry(`${origin}/?${query}`, { redirect: "manual" });
  expect(retired.status === 404 && !retired.headers.has("location"), `Retired query endpoint is not a true 404: ${query}`);
  expect(retired.headers.get("x-robots-tag")?.includes("noindex"), `Retired query endpoint is not noindex: ${query}`);
}
const campaignPage = await fetchWithRetry(`${origin}/?utm_source=facebook&utm_medium=social`, { redirect: "manual" });
expect(campaignPage.status === 200, "Campaign parameters incorrectly block the published homepage");

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${routes.length} production routes, mobile navigation, header styling, removals, schema, sitemap, redirects and true 404 verified.`);
