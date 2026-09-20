import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "source", "wordpress");
const dist = path.join(root, "dist");
const manifest = JSON.parse(readFileSync(path.join(dist, "build-manifest.json"), "utf8"));
const failures = [];
const expectedRoutes = ["/", "/gioi-thieu/", "/dich-vu/", "/gallery/", "/bang-gia/", "/phuong-thuc-thanh-toan/", "/lien-he/"];
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
  if (!html.includes('<meta name="robots" content="index, follow')) failures.push(`Indexable robots metadata is missing: ${route}`);
  if (!html.includes('application/ld+json') || !html.includes('LocalBusiness')) failures.push(`LocalBusiness structured data is missing: ${route}`);
  if (!html.includes('SiteNavigationElement') || !html.includes('OfferCatalog')) failures.push(`Expanded navigation or service structured data is missing: ${route}`);
  for (const marker of ['rel="manifest" href="/site.webmanifest"', 'name="twitter:image:alt"', 'name="google-site-verification"', 'name="p:domain_verify"']) {
    if (!html.includes(marker)) failures.push(`SEO/discovery marker is missing on ${route}: ${marker}`);
  }
  if (/<meta name="keywords"/i.test(html)) failures.push(`Obsolete keyword meta tag must not be used: ${route}`);
  if (html.includes("beta.sttailor.com")) failures.push(`Beta hostname remains in production HTML: ${route}`);
  if ((html.match(/<footer class="st-footer st-footer-v7 st-footer-v8"/g) ?? []).length !== 1) failures.push(`Footer is not singular: ${route}`);
  if (html.includes("https://sttailor.com/wp-content/uploads/")) failures.push(`Remote WordPress upload remains: ${route}`);
  if (/\batelier\b/i.test(visibleAndAccessibleText(html))) failures.push(`Visible or accessible Atelier wording remains: ${route}`);
  if (/\uFFFD|Ã.|Ä.|Æ.|áº.|á»./u.test(visibleAndAccessibleText(html))) failures.push(`Possible Unicode mojibake remains: ${route}`);
  for (const retired of ["/chinh-sach-bao-mat/", "/dieu-khoan-dieu-kien/", "/chinh-sach-van-chuyen/", "/bao-hanh-sua-chua/", "/refund_returns/"]) {
    if (html.includes(retired)) failures.push(`Retired route remains linked: ${route} -> ${retired}`);
  }
}
if (pageTitles.size !== expectedRoutes.length) failures.push("Every public route must have a unique SEO title.");
if (pageDescriptions.size !== expectedRoutes.length) failures.push("Every public route must have a unique meta description.");

for (const retiredDirectory of ["chinh-sach-bao-mat", "dieu-khoan-dieu-kien", "chinh-sach-van-chuyen", "bao-hanh-sua-chua", "refund_returns"]) {
  if (existsSync(path.join(dist, retiredDirectory))) failures.push(`Retired page was generated: /${retiredDirectory}/`);
}

const css = path.join(dist, "styles", "site.css");
const generatedCss = existsSync(css) ? readFileSync(css, "utf8") : "";
if (!existsSync(css) || statSync(css).size < 100000) failures.push("Full generated Custom CSS is missing or unexpectedly short.");
else {
  const approvedCss = readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8").replaceAll("https://sttailor.com/wp-content/uploads/", "/media/");
  if (!generatedCss.startsWith(approvedCss)) failures.push("Generated CSS does not preserve the complete approved WordPress CSS source.");
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
if (!home.includes("Five ways to begin with S.T Tailor") || !home.includes("Năm lối để bắt đầu cùng S.T Tailor")) failures.push("Home route invitation is missing.");
if (!home.includes("logo-sttailor-1000x1024.png")) failures.push("Footer crest logo is missing.");
if ((home.match(/<a class="st-home-editorial__frame/g) ?? []).length !== 3) failures.push("Home editorial triptych must contain exactly three image-led cards.");
if (!home.includes('/media/2026/09/st-tailor-client-fitted-suit.jpg') || home.includes('/media/2026/09/st-tailor-client-shoulder-fitting.jpg')) failures.push("Home FIT card does not use the approved fitted-suit image.");
if (!home.includes('rel="preload" as="image"') || !home.includes('fetchpriority="high"')) failures.push("Home hero image preload is missing.");
if (!home.includes('loading="lazy"') || home.includes('loading="eager"')) failures.push("Deferred images or map loading are not configured correctly.");
const footerSocial = home.match(/<nav class="st-footer-v7__social"[\s\S]*?<\/nav>/)?.[0] ?? "";
for (const channel of ["Facebook", "Zalo", "Instagram", "YouTube", "LinkedIn", "WhatsApp", "Pinterest", "TikTok"]) {
  if (!footerSocial.includes(channel)) failures.push(`Footer social channel missing: ${channel}`);
}
for (const excluded of ["Telephone", "Email"]) {
  if (footerSocial.includes(excluded)) failures.push(`Footer social channel must not include: ${excluded}`);
}
if (!home.includes("S.T Tailor showroom map")) failures.push("Shared footer is missing the Google Maps embed.");
if (home.includes("st-footer-v7__top") || home.includes("st-footer-v7__bottom")) failures.push("Removed footer bands are still present.");

const contact = readFileSync(path.join(dist, "lien-he", "index.html"), "utf8");
const contactCards = contact.match(/st-contact-card--[a-z]+/g) ?? [];
for (const channel of ["hotline", "whatsapp", "zalo", "email", "instagram", "messenger"]) {
  if (!contactCards.includes(`st-contact-card--${channel}`)) failures.push(`Contact channel missing: ${channel}`);
}
for (const excluded of ["linkedin", "facebook", "pinterest", "youtube", "tiktok"]) {
  if (contactCards.includes(`st-contact-card--${excluded}`)) failures.push(`Retired contact channel remains: ${excluded}`);
}
if (contact.includes("st-contact-hero") || contact.includes("Tell us what you are dressing for") || contact.includes("Hãy chia sẻ dịp sử dụng")) failures.push("Contact hero band still remains after the requested removal.");

const services = readFileSync(path.join(dist, "dich-vu", "index.html"), "utf8");
for (const removedBlock of ["st-service-hero", "st-service-offerings", "st-service-brief", "st-service-process", "st-service-house-standard", "st-service-notes", "st-service-gallery-redirect", "st-service-commission-map__journey"]) {
  if (services.includes(removedBlock)) failures.push(`Removed Services block remains: ${removedBlock}`);
}
if (!services.includes("THE BESPOKE PROCESS") || !services.includes("QUY TRÌNH MAY ĐO") || !services.includes("st-bespoke-process__steps")) failures.push("Redesigned bespoke process is missing from Services.");
if (!generatedCss.includes(".st-service-page .st-service-commission-map { margin-top: 0 !important; }")) failures.push("Services commission map still retains the removed top whitespace.");

const pricing = readFileSync(path.join(dist, "bang-gia", "index.html"), "utf8");
for (const removedPricingHero of ["stpr-hero", "BESPOKE PRICING", "BẢNG GIÁ MAY ĐO", "Clear starting prices", "Giá khởi điểm rõ ràng"]) {
  if (pricing.includes(removedPricingHero)) failures.push(`Removed Pricing hero content remains: ${removedPricingHero}`);
}

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

const gallery = readFileSync(path.join(dist, "gallery", "index.html"), "utf8");
if (gallery.includes("st-tailor-client-red-dinner-jacket.jpg")) failures.push("Retired red dinner jacket image remains in Gallery.");
for (const removedBlock of ["album-archive", "album-client-feedback", "st-gallery-closing"]) {
  if (gallery.includes(removedBlock)) failures.push(`Removed Gallery block remains: ${removedBlock}`);
}
if ((gallery.match(/st-gallery-numpad__card/g) ?? []).length !== 9) failures.push("Gallery 3x3 chapter navigator must contain exactly nine cards.");
if (!gallery.includes("st-gallery-numpad") || !gallery.includes("#album-tuxedo") || !gallery.includes("#album-showroom")) failures.push("Gallery chapter navigator is missing jump targets.");
for (const requiredAsset of ["st-tailor-archive-atelier-four.jpg", "st-tailor-gallery-partner-certificate.jpg"]) {
  if ((gallery.match(new RegExp(requiredAsset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length !== 1) failures.push(`Gallery retained image must appear exactly once: ${requiredAsset}`);
}

const notFound = readFileSync(path.join(dist, "404.html"), "utf8");
if (!notFound.includes("Back to Home") || !notFound.includes("Về trang chủ")) failures.push("404 page is missing the required Back to Home action.");

const productionHeaders = readFileSync(path.join(dist, "_headers"), "utf8");
if (/X-Robots-Tag:\s*noindex/i.test(productionHeaders)) failures.push("Production headers still prevent search indexing.");
for (const staticFile of ["robots.txt", "sitemap.xml", "llms.txt", "site.webmanifest"]) {
  if (!existsSync(path.join(dist, staticFile))) failures.push(`Missing production discovery file: ${staticFile}`);
}
const sitemap = readFileSync(path.join(dist, "sitemap.xml"), "utf8");
if ((sitemap.match(/<url><loc>https:\/\/sttailor\.com/g) ?? []).length !== expectedRoutes.length || sitemap.includes("beta.sttailor.com")) failures.push("Sitemap does not contain the complete production route set.");
if (!sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"') || !sitemap.includes("<image:image>")) failures.push("Image sitemap discovery data is missing.");
if (!sitemap.includes("<image:title>")) failures.push("Image sitemap titles are missing.");
if (!generatedCss.includes("width: min(320px, 84vw) !important") || !generatedCss.includes("justify-content: flex-start !important")) failures.push("Mobile navigation is not the requested left-aligned vertical panel.");

const worker = readFileSync(path.join(root, "src", "worker.js"), "utf8");
for (const legacyPath of ["/about/", "/services/", "/pricing/", "/payment-methods/", "/contact/", "/refund_returns/"]) {
  if (!worker.includes(legacyPath)) failures.push(`Legacy 301 mapping is missing: ${legacyPath}`);
}
if (!worker.includes('new URL("/not-found", url)')) failures.push("404 worker fallback does not fetch the canonical HTML asset body.");
for (const header of ["Strict-Transport-Security", "Content-Security-Policy", "X-Robots-Tag", "max-age=31536000, immutable"]) {
  if (!worker.includes(header)) failures.push(`Worker production header/cache rule is missing: ${header}`);
}
const siteScript = readFileSync(path.join(root, "src", "scripts", "site.js"), "utf8");
for (const key of ["Alt+M", "ArrowDown", "ArrowUp", "Escape", "Home", "End"]) {
  if (!siteScript.includes(key === "Alt+M" ? 'event.altKey' : `event.key === "${key}"`)) failures.push(`Navigation keyboard support is missing: ${key}`);
}
const wwwRedirect = readFileSync(path.join(root, "src", "www-redirect.js"), "utf8");
for (const redirectRule of ["status: 301", "Location: url.toString()", "max-age=86400", "Strict-Transport-Security"]) {
  if (!wwwRedirect.includes(redirectRule)) failures.push(`www redirect rule is missing: ${redirectRule}`);
}
const wwwWorkerConfig = readFileSync(path.join(root, "wrangler.www.jsonc"), "utf8");
if (!wwwWorkerConfig.includes('"pattern": "www.sttailor.com/*"') || !wwwWorkerConfig.includes('"zone_name": "sttailor.com"')) failures.push("www must use a zone Worker Route rather than a disposable custom domain.");
const wwwDnsScript = readFileSync(path.join(root, "scripts", "ensure-www-dns.mjs"), "utf8");
for (const marker of ["CLOUDFLARE_API_TOKEN", "www.sttailor.com", 'type: "AAAA"', "proxied: true"]) {
  if (!wwwDnsScript.includes(marker)) failures.push(`www DNS automation is missing: ${marker}`);
}
const wranglerConfig = readFileSync(path.join(root, "wrangler.jsonc"), "utf8");
if (!wranglerConfig.includes('"run_worker_first": true')) failures.push("Asset requests bypass the Worker header and cache policy.");

if (failures.length) throw new Error(`Migration checks failed:\n${failures.join("\n")}`);
console.log(`PASS: ${manifest.routes.length} WordPress-source routes, ${manifest.localUploadAssets} local uploads, shared footer/map, approved removals, gallery placement, 404 action and legacy mappings verified.`);
