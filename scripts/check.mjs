import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexNowKey, indexNowKeyFile } from "../src/indexnow.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "source", "wordpress");
const dist = path.join(root, "dist");
const manifest = JSON.parse(readFileSync(path.join(dist, "build-manifest.json"), "utf8"));
const failures = [];
const expectedRoutes = ["/", "/gioi-thieu/", "/dich-vu/", "/gallery/", "/bang-gia/", "/phuong-thuc-thanh-toan/", "/lien-he/", "/cam-nang-may-do/", "/chon-vai-may-do/", "/quy-trinh-thu-do/", "/chinh-sua-trang-phuc/", "/bao-quan-giat-la/", "/doi-tra-hoan-tien/", "/chinh-sach-van-chuyen/", "/dieu-khoan-dieu-kien/", "/chinh-sach-bao-mat/"];
const pageTitles = new Set();
const pageDescriptions = new Set();

function visibleAndAccessibleText(html) {
  const alts = [...html.matchAll(/\balt=(['"])([\s\S]*?)\1/gi)].map((match) => match[2]);
  const text = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return `${text} ${alts.join(" ")}`;
}

if (manifest.source !== "source/wordpress" || manifest.sourceMedia !== "source/media") failures.push("Build did not use the versioned WordPress and media source.");
if (!manifest.revision || !/^(local|[0-9a-f]{40})$/i.test(manifest.revision)) failures.push("Build manifest does not contain a valid deployment revision.");
if (JSON.stringify(manifest.routes) !== JSON.stringify(expectedRoutes)) failures.push("Published route set does not match the approved site map.");

for (const route of expectedRoutes) {
  const page = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  if (!existsSync(page)) {
    failures.push(`Missing page: ${route}`);
    continue;
  }
  const html = readFileSync(page, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
  if (!title || title.length < 30 || title.length > 65) failures.push(`SEO title length is outside the useful range: ${route}`);
  if (!description || description.length < 100 || description.length > 170) failures.push(`SEO description length is outside the useful range: ${route}`);
  pageTitles.add(title);
  pageDescriptions.add(description);
  if (!html.includes("st-site-header") || !html.includes("st-footer-v7 st-footer-v8")) failures.push(`Missing shared navigation or footer: ${route}`);
  if (!html.startsWith('<!doctype html><html lang="en">')) failures.push(`Primary document language is incorrect: ${route}`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) failures.push(`Page must contain exactly one H1: ${route}`);
  if (!html.includes('name="sttailor-build-revision"')) failures.push(`Build revision marker is missing: ${route}`);
  if (!html.includes('<meta name="robots" content="index, follow')) failures.push(`Indexable robots metadata is missing: ${route}`);
  if (!html.includes('application/ld+json') || !html.includes('LocalBusiness')) failures.push(`LocalBusiness structured data is missing: ${route}`);
  if (!html.includes('SiteNavigationElement') || !html.includes('OfferCatalog')) failures.push(`Expanded navigation or service structured data is missing: ${route}`);
  if ((html.match(/g\.src="\/n31x\/"/g) ?? []).length !== 1 || !html.includes('gtag("config","G-BQDKE20XR0")') || html.includes('googletagmanager.com/gtag/js')) failures.push(`First-party Google Analytics 4 tag is missing or duplicated: ${route}`);
  if ((html.match(/clarity\.ms\/tag\//g) ?? []).length !== 1 || !html.includes('"ymcn0kdqo0"')) failures.push(`Microsoft Clarity tag is missing or duplicated: ${route}`);
  if (html.includes("data-consent-panel") || html.includes("data-consent-open")) failures.push(`Unrequested privacy controls remain: ${route}`);
  const schemaText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
  const schemaGraph = schemaText ? JSON.parse(schemaText)["@graph"] : [];
  const businessSchema = schemaGraph.find((item) => Array.isArray(item["@type"]) && item["@type"].includes("LocalBusiness"));
  if ((html.match(/href="https:\/\/x\.com\/sttalior"/g) ?? []).length !== 1 || (businessSchema?.sameAs ?? []).filter((url) => url === "https://x.com/sttalior").length !== 1) failures.push(`Official X profile is missing or duplicated in social links/schema: ${route}`);
  for (const marker of ['rel="manifest" href="/site.webmanifest"', 'name="twitter:image:alt"', 'name="google-site-verification"', 'name="p:domain_verify"']) {
    if (!html.includes(marker)) failures.push(`SEO/discovery marker is missing on ${route}: ${marker}`);
  }
  if (/<meta name="keywords"/i.test(html)) failures.push(`Obsolete keyword meta tag must not be used: ${route}`);
  if (html.includes("beta.sttailor.com")) failures.push(`Beta hostname remains in production HTML: ${route}`);
  if ((html.match(/<footer class="st-footer st-footer-v7 st-footer-v8"/g) ?? []).length !== 1) failures.push(`Footer is not singular: ${route}`);
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? "";
  const footerLinks = new Set([...footer.matchAll(/\bhref="(\/[^"]*)"/g)].map((match) => match[1]));
  for (const [, href] of html.matchAll(/\bhref="(\/[^"]*)"/g)) {
    const pathname = decodeURIComponent(new URL(href, "https://sttailor.com").pathname);
    const asset = path.join(dist, pathname.replace(/^\/+/, ""), pathname.endsWith("/") ? "index.html" : "");
    if (!existsSync(asset)) failures.push("Broken internal link on " + route + ": " + href);
  }
  for (const publishedRoute of expectedRoutes) {
    if (!footerLinks.has(publishedRoute)) failures.push(`Footer on ${route} omits published page ${publishedRoute}`);
  }
  if (!/<nav class="st-footer-v7__nav"[\s\S]*?<a href="\/">Home <span lang="vi">Trang chủ<\/span><\/a>/i.test(footer)) failures.push(`Footer on ${route} lacks a visible Home navigation link.`);
  if (html.includes("https://sttailor.com/wp-content/uploads/")) failures.push(`Remote WordPress upload remains: ${route}`);
  if (/https:\/\/(?:api\.iconify\.design|cdn\.simpleicons\.org)\//i.test(html)) failures.push(`Third-party icon remains in built page: ${route}`);
  for (const image of html.matchAll(/<img\b[^>]*\bsrc="\/media\/[^"]+"[^>]*>/gi)) {
    if (!/\bwidth="\d+"/i.test(image[0]) || !/\bheight="\d+"/i.test(image[0])) failures.push(`Local image is missing intrinsic dimensions: ${route}`);
    if (!/\bsrcset="[^"]+\.webp \d+w/i.test(image[0])) failures.push(`Local image is missing responsive WebP candidates: ${route}`);
  }
  for (const image of html.matchAll(/<img\b[^>]*\bsrc="(\/icons\/[^"]+)"[^>]*>/gi)) {
    if (!/\bwidth="\d+"/i.test(image[0]) || !/\bheight="\d+"/i.test(image[0])) failures.push(`Local icon is missing intrinsic dimensions: ${route}`);
    if (!existsSync(path.join(dist, image[1].slice(1)))) failures.push(`Local icon asset is missing: ${route} ${image[1]}`);
  }
  if (/\batelier\b/i.test(visibleAndAccessibleText(html))) failures.push(`Visible or accessible Atelier wording remains: ${route}`);
  if (/\uFFFD|Ã.|Ä.|Æ.|áº.|á»./u.test(visibleAndAccessibleText(html))) failures.push(`Possible Unicode mojibake remains: ${route}`);
  for (const retired of ["/bao-hanh-sua-chua/", "/refund_returns/"]) {
    if (html.includes(retired)) failures.push(`Retired route remains linked: ${route} -> ${retired}`);
  }
}
if (pageTitles.size !== expectedRoutes.length) failures.push("Every public route must have a unique SEO title.");
if (pageDescriptions.size !== expectedRoutes.length) failures.push("Every public route must have a unique meta description.");

const missingPage = readFileSync(path.join(dist, "404.html"), "utf8");
if (!missingPage.includes('<meta name="robots" content="noindex, follow">') || !missingPage.includes('<meta name="googlebot" content="noindex, follow">') || /<link rel="canonical"/.test(missingPage) || missingPage.includes('application/ld+json')) {
  failures.push("The 404 document must be noindex without a homepage canonical or page schema.");
}

for (const [route, groups] of Object.entries({
  "/doi-tra-hoan-tien/": [
    ["We compare the delivered garment", "No sentence on this page", "Chúng tôi đối chiếu trang phục", "Không nội dung nào trên trang này"],
    ["If a garment does not match", "Fit preferences can change", "Nếu trang phục không đúng", "Cảm nhận về độ vừa"],
    ["Tell us in writing if you wish to cancel", "If the written order expressly", "Nếu muốn hủy đơn", "Nếu đơn hàng bằng văn bản"]
  ]
})) {
  const page = path.join(dist, route.slice(1), "index.html");
  if (!existsSync(page)) continue;
  const html = readFileSync(page, "utf8");
  for (const [enFirst, enSecond, viFirst, viSecond] of groups) {
    const positions = [enFirst, enSecond, viFirst, viSecond].map((text) => html.indexOf(text));
    if (positions.some((position) => position < 0) || positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
      failures.push(`Bilingual paragraphs must read English-English then Vietnamese-Vietnamese on ${route}: ${enFirst}`);
    }
  }
}

for (const retiredDirectory of ["bao-hanh-sua-chua", "refund_returns"]) {
  if (existsSync(path.join(dist, retiredDirectory))) failures.push(`Retired page was generated: /${retiredDirectory}/`);
}

const css = path.join(dist, "styles", "site.css");
const generatedCss = existsSync(css) ? readFileSync(css, "utf8") : "";
const editableCss = existsSync(path.join(root, "CustomCSS-Full.css")) ? readFileSync(path.join(root, "CustomCSS-Full.css"), "utf8") : "";
if (!existsSync(css) || statSync(css).size < 100000) failures.push("Full generated Custom CSS is missing or unexpectedly short.");
else {
  const approvedCss = readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8").replaceAll("https://sttailor.com/wp-content/uploads/", "/media/");
  if (!editableCss.startsWith(approvedCss)) failures.push("Editable CSS export does not preserve the complete approved WordPress CSS source.");
  if (generatedCss.length >= editableCss.length) failures.push("Production CSS was not minified.");
  if (generatedCss.includes("migration.css")) failures.push("Retired migration stylesheet remains in the generated CSS.");
  const sourceMotion = {
    keyframes: (approvedCss.match(/@keyframes\s+[\w-]+/g) ?? []).length,
    animations: (approvedCss.match(/\banimation(?:-name)?\s*:/g) ?? []).length,
    transitions: (approvedCss.match(/\btransition(?:-property)?\s*:/g) ?? []).length
  };
  const generatedMotion = {
    keyframes: (generatedCss.match(/@keyframes\s+[\w-]+/g) ?? []).length,
    animations: (generatedCss.match(/\banimation(?:-name)?\s*:/g) ?? []).length,
    transitions: (generatedCss.match(/\btransition(?:-property)?\s*:/g) ?? []).length
  };
  for (const key of Object.keys(sourceMotion)) {
    if (generatedMotion[key] < sourceMotion[key]) failures.push(`WordPress motion definitions were lost: ${key}.`);
  }
}

const home = readFileSync(path.join(dist, "index.html"), "utf8");
if (home.includes("st-home-v6__gallery")) failures.push("The removed home gallery strip is still present.");
if (!home.includes("ARRANGE A PRIVATE CONSULTATION") || !home.includes("ĐẶT LỊCH TƯ VẤN RIÊNG")) failures.push("Home consultation CTA is missing.");
for (const removedHomeRouteText of ["Five ways into the atelier", "Five ways to begin with S.T Tailor", "Năm lối để bước vào không gian atelier", "Năm lối để bắt đầu cùng S.T Tailor", "st-home-v6__routes"]) {
  if (home.includes(removedHomeRouteText)) failures.push(`Removed home route strip remains: ${removedHomeRouteText}`);
}
if (!home.includes("logo-sttailor-1000x1024.png")) failures.push("Footer crest logo is missing.");
if (/<footer[\s\S]*?<img\b(?![^>]*\bwidth="\d+")(?![^>]*\bheight="\d+")[^>]*>/i.test(home)) failures.push("Footer contains an image without explicit dimensions.");
if ((home.match(/<a class="st-home-editorial__frame/g) ?? []).length !== 5) failures.push("Home visual destinations must contain exactly five image-led cards.");
for (const visualDestination of ["/gioi-thieu/", "/dich-vu/", "/gallery/", "/bang-gia/", "/lien-he/", "st-tailor-client-private-consultation.jpg"]) {
  if (!home.includes(visualDestination)) failures.push(`Home visual destination is missing: ${visualDestination}`);
}
if (!home.includes('/media/2026/09/st-tailor-client-fitted-suit.jpg') || home.includes('/media/2026/09/st-tailor-client-shoulder-fitting.jpg')) failures.push("Home FIT card does not use the approved fitted-suit image.");
if (!home.includes('rel="preload" as="image"') || !home.includes('fetchpriority="high"')) failures.push("Home hero image preload is missing.");
if (!home.includes('loading="lazy"') || home.includes('loading="eager"')) failures.push("Deferred images or map loading are not configured correctly.");
if (!home.includes('class="st-home-guide-strip"') || !home.includes('href="/cam-nang-may-do/"')) failures.push("Home tailoring-guide discovery strip is missing.");
const footerSocial = home.match(/<nav class="st-footer-v7__social"[\s\S]*?<\/nav>/)?.[0] ?? "";
for (const channel of ["Facebook", "Zalo", "Instagram", "YouTube", "LinkedIn", "WhatsApp", "Pinterest", "TikTok"]) {
  if (!footerSocial.includes(channel)) failures.push(`Footer social channel missing: ${channel}`);
}
for (const excluded of ["Telephone", "Email"]) {
  if (footerSocial.includes(excluded)) failures.push(`Footer social channel must not include: ${excluded}`);
}
if (!home.includes("S.T Tailor showroom map")) failures.push("Shared footer is missing the Google Maps embed.");
if (home.includes("st-footer-v7__top")) failures.push("Removed footer promotion band is still present.");
if (!home.includes('class="st-footer-v7__bottom st-footer-v8__legal"') || !home.includes('aria-label="Client policies"')) failures.push("Right-aligned client policy section is missing.");

const contact = readFileSync(path.join(dist, "lien-he", "index.html"), "utf8");
const contactCards = contact.match(/st-contact-card--[a-z]+/g) ?? [];
for (const channel of ["hotline", "whatsapp", "zalo", "email", "instagram", "messenger"]) {
  if (!contactCards.includes(`st-contact-card--${channel}`)) failures.push(`Contact channel missing: ${channel}`);
}
for (const excluded of ["linkedin", "facebook", "pinterest", "youtube", "tiktok"]) {
  if (contactCards.includes(`st-contact-card--${excluded}`)) failures.push(`Retired contact channel remains: ${excluded}`);
}
if (contact.includes("st-contact-hero") || contact.includes("Tell us what you are dressing for") || contact.includes("Hãy chia sẻ dịp sử dụng")) failures.push("Contact hero band still remains after the requested removal.");
if ((contact.match(/<h1\b/g) ?? []).length !== 1 || !contact.includes("CONTACT DETAILS")) failures.push("Contact page must retain one semantic H1 after its introduction band is removed.");

const services = readFileSync(path.join(dist, "dich-vu", "index.html"), "utf8");
for (const removedBlock of ["st-service-hero", "st-service-offerings", "st-service-brief", "st-service-process", "st-service-house-standard", "st-service-notes", "st-service-gallery-redirect", "st-service-commission-map__journey"]) {
  if (services.includes(removedBlock)) failures.push(`Removed Services block remains: ${removedBlock}`);
}
if (!services.includes("THE BESPOKE PROCESS") || !services.includes("QUY TRÌNH MAY ĐO") || !services.includes("st-bespoke-process__steps")) failures.push("Redesigned bespoke process is missing from Services.");
if ((services.match(/<h1\b/g) ?? []).length !== 1) failures.push("Services must contain exactly one primary H1 heading.");
const commissionMapRule = [...generatedCss.matchAll(/\.st-service-page\s+\.st-service-commission-map\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("margin-top:0!important"));
if (!commissionMapRule) failures.push("Services commission map still retains the removed top whitespace.");
for (const retiredServiceGalleryFeature of ["st-service-gallery-suite", "st-tailor-client-measurement-session.jpg", "st-tailor-gallery-jacket-lining-mannequin.jpg", "OPEN THE GALLERY"]) {
  if (services.includes(retiredServiceGalleryFeature)) failures.push(`Retired Services Gallery route remains: ${retiredServiceGalleryFeature}`);
}
if (!services.includes("st-tailor-client-fabric-consultation.jpg")) failures.push("Services social thumbnail must use the approved fabric-consultation image.");
if (services.includes("st-tailor-client-shoulder-fitting.jpg")) failures.push("Services still exposes the retired shoulder-fitting thumbnail.");
if (!services.includes('og:image" content="https://sttailor.com/media/2026/09/st-tailor-client-fabric-consultation.jpg"')) failures.push("Services social thumbnail does not use the approved fabric-consultation image.");

const pricing = readFileSync(path.join(dist, "bang-gia", "index.html"), "utf8");
for (const removedPricingHero of ["stpr-hero", "BESPOKE PRICING", "BẢNG GIÁ MAY ĐO", "Clear starting prices", "Giá khởi điểm rõ ràng"]) {
  if (pricing.includes(removedPricingHero)) failures.push(`Removed Pricing hero content remains: ${removedPricingHero}`);
}
if ((pricing.match(/<h1\b/g) ?? []).length !== 1) failures.push("Pricing must contain exactly one primary H1 heading.");
for (const pricingGalleryFeature of ["st-pricing-gallery-suite", 'href="/gallery/"', "st-tailor-gallery-canonico-cloth-books.jpg", "st-tailor-gallery-shoulder-lapel-detail.jpg", "VIEW THE GALLERY"]) {
  if (!pricing.includes(pricingGalleryFeature)) failures.push(`Pricing visual Gallery route is missing: ${pricingGalleryFeature}`);
}

const payment = readFileSync(path.join(dist, "phuong-thuc-thanh-toan", "index.html"), "utf8");
for (const paymentFeature of ["st-payment-compliance", "PAYMENT &amp; ORDER TERMS", "ĐIỀU KHOẢN THANH TOÁN", "Visa", "Mastercard", "American Express", "JCB", "Apple Pay", "Google Wallet", "Samsung Wallet", "PayPal", "Wise", "19/2023/QH15", "20/2023/QH15", "52/2024/NĐ-CP", "70/2025/NĐ-CP", "91/2025/QH15"]) {
  if (!payment.includes(paymentFeature)) failures.push(`Payment terms or legal framework is missing: ${paymentFeature}`);
}
for (const paymentGalleryFeature of ["st-payment-gallery-suite", 'href="/gallery/"', "st-tailor-gallery-showroom-tailoring-display.jpg", "ENTER THE GALLERY"]) {
  if (!payment.includes(paymentGalleryFeature)) failures.push(`Payment visual Gallery route is missing: ${paymentGalleryFeature}`);
}
if (!payment.includes("st-policy-refund-link") || !payment.includes('href="/doi-tra-hoan-tien/"') || payment.includes("contacting the atelier")) failures.push("Payment must link to the current returns policy without retired wording.");

const about = readFileSync(path.join(dist, "gioi-thieu", "index.html"), "utf8");
for (const removedBlock of ["st-lux-gallery-redirect", "st-lux-appointment", "st-lux-provenance__archive-note", "WHAT GUIDES THE WORK"]) {
  if (about.includes(removedBlock)) failures.push(`Removed About block remains: ${removedBlock}`);
}
for (const clothFeature of ["st-cloth-heritage", "British cloth", "Italian cloth", "Vitale Barberis Canonico", "Vietnamese silk"]) {
  if (!about.includes(clothFeature)) failures.push(`About cloth heritage feature is missing: ${clothFeature}`);
}
for (const aboutSeoFeature of ["st-about-discovery", "PRIVATE TAILORING IN HO CHI MINH CITY", "CLOTHING ALTERATIONS", "taxID", "Founder & Tailoring Consultant", "AboutPage"]) {
  if (!about.includes(aboutSeoFeature)) failures.push(`About SEO/discovery feature is missing: ${aboutSeoFeature}`);
}
if (!about.includes('href="/chinh-sua-trang-phuc/"')) failures.push("About alterations discovery does not lead to the dedicated guide.");

const guideHub = readFileSync(path.join(dist, "cam-nang-may-do", "index.html"), "utf8");
for (const marker of ["st-guide-page", "st-guide-index", "/chon-vai-may-do/", "/quy-trinh-thu-do/", "/chinh-sua-trang-phuc/", "/bao-quan-giat-la/"]) {
  if (!guideHub.includes(marker)) failures.push(`Tailoring guide hub is missing: ${marker}`);
}
for (const route of ["chon-vai-may-do", "quy-trinh-thu-do", "chinh-sua-trang-phuc", "bao-quan-giat-la"]) {
  const guide = readFileSync(path.join(dist, route, "index.html"), "utf8");
  if (!guide.includes("st-guide-article") || !guide.includes('href="/cam-nang-may-do/"')) failures.push(`Guide article structure is incomplete: /${route}/`);
}
const careGuide = readFileSync(path.join(dist, "bao-quan-giat-la", "index.html"), "utf8");
for (const marker of ["CARE LABEL FIRST", "Đọc ký hiệu trước khi giặt", "Woolmark", "GINETEX", "Dry Clean Only"]) {
  if (!careGuide.includes(marker)) failures.push(`Garment-care guide is missing: ${marker}`);
}
for (const aboutGalleryFeature of ["st-about-gallery-bridge", 'href="/gallery/"', "THE S.T TAILOR GALLERY", "st-tailor-floral-dinner-jacket-showroom.png", "VIEW THE GALLERY"]) {
  if (!about.includes(aboutGalleryFeature)) failures.push(`About image-led Gallery discovery feature is missing: ${aboutGalleryFeature}`);
}

const gallery = readFileSync(path.join(dist, "gallery", "index.html"), "utf8");
if (gallery.includes("st-tailor-client-red-dinner-jacket.jpg")) failures.push("Retired red dinner jacket image remains in Gallery.");
for (const removedBlock of ["album-archive", "album-client-feedback", "st-gallery-closing"]) {
  if (gallery.includes(removedBlock)) failures.push(`Removed Gallery block remains: ${removedBlock}`);
}
if ((gallery.match(/st-gallery-numpad__card/g) ?? []).length !== 9) failures.push("Gallery 3x3 chapter navigator must contain exactly nine cards.");
if (!gallery.includes("st-gallery-numpad") || !gallery.includes("#album-tuxedo") || !gallery.includes("#album-showroom")) failures.push("Gallery chapter navigator is missing jump targets.");
const galleryImageTags = [...gallery.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^\"]+)"[^>]*>/gi)];
const galleryContentImages = galleryImageTags.filter((match) => !match[1].includes("logo-sttailor") && !match[1].endsWith("/LinkedInLogo.png"));
if (galleryContentImages.length !== 99) failures.push("Gallery must retain exactly 99 approved editorial images.");
for (const image of galleryContentImages) {
  const alt = /\balt="([^\"]*)"/i.exec(image[0])?.[1] ?? "";
  if (!alt || !alt.includes(" | ")) failures.push(`Gallery image is missing a bilingual alt text: ${image[1]}`);
  if (!/\bwidth="\d+"/i.test(image[0]) || !/\bheight="\d+"/i.test(image[0])) failures.push(`Gallery image is missing intrinsic dimensions: ${image[1]}`);
  if (!/\bsrcset="[^\"]+\.webp \d+w/i.test(image[0])) failures.push(`Gallery image is missing responsive WebP candidates: ${image[1]}`);
}
if (!gallery.includes('"@type":"ItemList"') || !gallery.includes(`"numberOfItems":${galleryContentImages.length}`)) failures.push("Gallery image structured data is missing or incomplete.");
for (const requiredAsset of ["st-tailor-archive-atelier-four.jpg", "st-tailor-gallery-partner-certificate.jpg"]) {
  if (galleryContentImages.filter((image) => image[1].endsWith(`/${requiredAsset}`)).length !== 1) failures.push(`Gallery retained image must appear exactly once: ${requiredAsset}`);
}

const notFound = readFileSync(path.join(dist, "404.html"), "utf8");
if (!notFound.includes("Back to Home") || !notFound.includes("Về trang chủ")) failures.push("404 page is missing the required Back to Home action.");

const productionHeaders = readFileSync(path.join(dist, "_headers"), "utf8");
if (/X-Robots-Tag:\s*noindex/i.test(productionHeaders)) failures.push("Production headers still prevent search indexing.");
if (!productionHeaders.includes("Strict-Transport-Security: max-age=15552000")) failures.push("Production HSTS must remain the conservative six-month policy.");
for (const staticFile of ["robots.txt", "sitemap.xml", "llms.txt", "site.webmanifest", indexNowKeyFile]) {
  if (!existsSync(path.join(dist, staticFile))) failures.push(`Missing production discovery file: ${staticFile}`);
}
if (existsSync(path.join(dist, indexNowKeyFile)) && readFileSync(path.join(dist, indexNowKeyFile), "utf8") !== `${indexNowKey}\n`) {
  failures.push("IndexNow ownership key file does not contain the expected key.");
}
const sitemap = readFileSync(path.join(dist, "sitemap.xml"), "utf8");
if ((sitemap.match(/<url><loc>https:\/\/sttailor\.com/g) ?? []).length !== expectedRoutes.length || sitemap.includes("beta.sttailor.com")) failures.push("Sitemap does not contain the complete production route set.");
if (!sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"') || !sitemap.includes("<image:image>")) failures.push("Image sitemap discovery data is missing.");
if (!sitemap.includes("<image:title>")) failures.push("Image sitemap titles are missing.");
const gallerySitemap = sitemap.match(/<url><loc>https:\/\/sttailor\.com\/gallery\/[\s\S]*?<\/url>/)?.[0] ?? "";
if ((gallerySitemap.match(/<image:image>/g) ?? []).length !== 99) failures.push("Gallery image sitemap does not expose every editorial image exactly once.");
if ((sitemap.match(/<image:loc>/g) ?? []).length !== new Set([...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1])).size) failures.push("Image sitemap contains duplicate image locations.");
const mobileNavRule = [...generatedCss.matchAll(/\.st-site-nav\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("width:100vw!important"));
const mobileNavLinkRule = [...generatedCss.matchAll(/\.st-site-nav a[^\{]*\{[^}]*\}/g)]
  .map((match) => match[0])
  .find((rule) => rule.includes("justify-content:flex-start!important"));
if (!mobileNavRule?.includes("left:50%!important") || !mobileNavLinkRule) failures.push("Mobile navigation is not the requested full-width, left-aligned panel.");

const worker = readFileSync(path.join(root, "src", "worker.js"), "utf8");
for (const legacyPath of ["/about/", "/services/", "/pricing/", "/payment-methods/", "/contact/", "/refund_returns/"]) {
  if (!worker.includes(legacyPath)) failures.push(`Legacy 301 mapping is missing: ${legacyPath}`);
}
if (!worker.includes('new URL("/not-found", url)')) failures.push("404 worker fallback does not fetch the canonical HTML asset body.");
for (const header of ["Strict-Transport-Security", "Content-Security-Policy", "X-Robots-Tag", "max-age=31536000, immutable", "max-age=604800"]) {
  if (!worker.includes(header)) failures.push(`Worker production header/cache rule is missing: ${header}`);
}
if (!worker.includes('"max-age=15552000"')) failures.push("Worker HSTS policy is not the conservative six-month duration.");
const siteScript = readFileSync(path.join(root, "src", "scripts", "site.js"), "utf8");
for (const key of ["Alt+M", "ArrowDown", "ArrowUp", "Escape", "Home", "End"]) {
  if (!siteScript.includes(key === "Alt+M" ? 'event.altKey' : `event.key === "${key}"`)) failures.push(`Navigation keyboard support is missing: ${key}`);
}
for (const marker of ['"contact_click"', '"consultation_intent"', '"page_type"', '"site_locale"', 'contact_method:', 'link_placement:']) {
  if (!siteScript.includes(marker)) failures.push(`Analytics or Clarity interaction instrumentation is missing: ${marker}`);
}
const wwwRedirect = readFileSync(path.join(root, "src", "www-redirect.js"), "utf8");
for (const redirectRule of ["status: 301", "Location: url.toString()", "max-age=86400", "Strict-Transport-Security"]) {
  if (!wwwRedirect.includes(redirectRule)) failures.push(`www redirect rule is missing: ${redirectRule}`);
}
if (!wwwRedirect.includes('"max-age=15552000"')) failures.push("www redirect HSTS policy is not the conservative six-month duration.");
const wwwWorkerConfig = readFileSync(path.join(root, "wrangler.www.jsonc"), "utf8");
if (!wwwWorkerConfig.includes('"pattern": "www.sttailor.com/*"') || !wwwWorkerConfig.includes('"zone_name": "sttailor.com"')) failures.push("www must use a zone Worker Route rather than a disposable custom domain.");
const wwwDnsScript = readFileSync(path.join(root, "scripts", "ensure-www-dns.mjs"), "utf8");
for (const marker of ["CLOUDFLARE_API_TOKEN", "www.sttailor.com", 'type: "AAAA"', "proxied: true", 'type: "TXT"', "apple-domain-verification=yQzSEAR1bU9DtwAF"]) {
  if (!wwwDnsScript.includes(marker)) failures.push(`www DNS automation is missing: ${marker}`);
}
const wranglerConfig = readFileSync(path.join(root, "wrangler.jsonc"), "utf8");
if (!wranglerConfig.includes('"run_worker_first": true')) failures.push("Asset requests bypass the Worker header and cache policy.");

if (failures.length) throw new Error(`Migration checks failed:\n${failures.join("\n")}`);
console.log(`PASS: ${manifest.routes.length} WordPress-source routes, ${manifest.localUploadAssets} local uploads, shared footer/map, approved removals, gallery placement, 404 action and legacy mappings verified.`);
