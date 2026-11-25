import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { transform as minifyCss } from "lightningcss";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexNowKey, indexNowKeyFile } from "../src/indexnow.js";
import { tripadvisorEmbedPath } from "../src/security-policy.js";
import { clientCareHubRoute, clientCarePage } from "../src/client-care-pages.js";
import { tailoringPages } from "../src/tailoring-pages.js";
import { showcaseEntries, showcaseHubs, showcaseItemsFor, showcasePages } from "../src/showcase-pages.js";
import { fittingFilm as galleryFilm, fittingFilmRoute } from "../src/fitting-film.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// The approved WordPress layout remains the baseline; current page refinements
// are derived below. Its retired social link was removed at the owner's request.
const sourceRoot = path.join(root, "source", "wordpress");
const sourceMedia = path.join(root, "source", "media");
const sourceIcons = path.join(root, "source", "icons");
const sourceFonts = path.join(root, "source", "fonts");
const vietnameseFont = "noto-sans-vi-8b0a1d0.woff2";
const iconPaths = JSON.parse(readFileSync(path.join(sourceIcons, "manifest.json"), "utf8"));
const dist = path.join(root, "dist");
let stylesheetHref = "/styles/site.css";
const buildRevision = /^[0-9a-f]{40}$/i.test(process.env.STTAILOR_BUILD_REVISION || "")
  ? process.env.STTAILOR_BUILD_REVISION
  : "local";
let scriptHref = "/scripts/site.js";
let imageManifest = {};
const homeHeroImage = "/media/2026/06/background-hero-trang-lien-he-sttailor.webp";
const galleryHeroImage = "/media/2026/09/st-tailor-made-to-measure-stories-gallery.jpg";
// The portrait cover is up to 740px tall: 740 * 1717 / 916 needs ~1387 source pixels.
// A viewport-width hint would upscale the 480px derivative and blur the fitting.
const homeHeroSizes = "(max-width: 760px) 1400px, 1717px";
const homeHeroPortraitMedia = "(max-width: 600px) and (orientation: portrait)";
const homeEditorialSizes = "(max-width: 440px) calc(100vw - 34px), (max-width: 760px) calc(50vw - 24px), (max-width: 1120px) calc(33vw - 30px), min(calc(20vw - 30px), 240px)";
const galleryHeroSizes = "(max-width: 899px) min(calc(100vw - 32px), 760px), min(calc(50vw - 24px), 590px)";
const showcaseHeroSizes = "(max-width: 760px) min(calc(100vw - 34px), 520px), min(calc(45vw - 36px), 490px)";
const showcaseCardSizes = "(max-width: 600px) calc(100vw - 34px), (max-width: 1080px) calc(50vw - 30px), min(calc(33.33vw - 32px), 371px)";
const suitFitGuide = tailoringPages.find(({ source }) => source === "GuideSuitFit.html");
const suitFitHeroSizes = "(max-width: 560px) min(calc(100vw - 28px), 420px), (max-width: 860px) 420px, min(calc(44vw - 40px), 440px)";
const liningGuide = tailoringPages.find(({ source }) => source === "GuideJacketLining.html");
const liningHeroSizes = "(max-width: 860px) min(calc(100vw - 48px), 480px), min(calc(45vw - 46px), 480px)";

function imageSourceSet(candidates) {
  return candidates.map(({ src, width }) => `${src} ${width}w`).join(", ");
}
const googleTagManagerHead = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var started=false;function load(){if(started)return;started=true;var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
}function schedule(){
  w.setTimeout(load,1200);
  if(d.visibilityState==='visible'&&w.requestIdleCallback)
    w.requestAnimationFrame(()=>w.requestAnimationFrame(()=>w.requestIdleCallback(load,{timeout:1200})));
}
if(d.readyState==='complete')schedule();else w.addEventListener('load',schedule,{once:true});
w.addEventListener('pointerdown',load,{once:true,passive:true});w.addEventListener('keydown',load,{once:true});
})(window,document,'script','dataLayer','GTM-TQSDB6XT');</script>
<!-- End Google Tag Manager -->`;
const googleTagManagerNoScript = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQSDB6XT"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
// GTM owns the Meta Pixel JavaScript tag. This fallback runs only without JS.
const metaPixelNoScript = `<noscript><img height="1" width="1" style="display:none" alt="" aria-hidden="true" src="https://www.facebook.com/tr?id=2294442874726399&amp;ev=PageView&amp;noscript=1"></noscript>`;
// Production measurement IDs are public browser identifiers, not credentials.
// Keep the vendors here so every generated route receives exactly one copy.
// Keep both measurement queues available immediately. GTM owns the published
// Clarity tag; only the existing first-party Google tag is downloaded here,
// after the first paint when Cloudflare has not already injected its gateway.
// Loading Clarity here as well records sessions twice.
const analyticsTags = `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-BQDKE20XR0");(function(c,l,a){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}})(window,document,"clarity");(()=>{const load=()=>{if(window.__stAnalyticsLoaded)return;window.__stAnalyticsLoaded=true;if([...document.scripts].some(s=>s.src.split("?")[0]===location.origin+"/n31x/"))return;const g=document.createElement("script");g.async=true;g.src="/n31x/";document.head.appendChild(g);};const idle=window.requestIdleCallback||((cb)=>setTimeout(cb,1200));if(document.readyState==="complete")idle(load);else window.addEventListener("load",()=>idle(load),{once:true})})();</script>`;

const routes = [
  ["/", "Home.html", "S.T Tailor | Bespoke Tailoring in Ho Chi Minh City", "Bespoke suits, shirts, formalwear and alterations at 1st Floor, 258 Le Thanh Ton, Tan Dinh Ward, Ho Chi Minh City. Private consultations available.", "/media/2026/06/background-hero-trang-lien-he-sttailor.webp", "Private fitting at S.T Tailor in Ho Chi Minh City"],
  ["/gioi-thieu/", "About.html", "About S.T Tailor | Bespoke Tailoring & Alterations in HCMC", "Meet S.T Tailor in Ho Chi Minh City for bespoke suits, formalwear, clothing alterations, British and Italian cloth, Vietnamese silk and private fittings.", "/media/2026/09/fabric-focus-cloth-books.jpg", "Tailoring cloth books selected at S.T Tailor"],
  ["/dich-vu/", "Services.html", "Bespoke Tailoring & Alterations in HCMC | S.T Tailor", "Explore bespoke suits, shirts, formalwear, womenswear, fittings and clothing alterations by S.T Tailor in central Ho Chi Minh City.", "/media/2026/09/st-tailor-client-fabric-consultation.jpg", "Client reviewing tailoring fabrics with S.T Tailor | Khách hàng chọn vải may đo cùng S.T Tailor"],
  ["/gallery/", "Gallery.html", "Bespoke Tailoring Gallery in HCMC | S.T Tailor", "View S.T Tailor's cloth, fittings, suits, formalwear, womenswear, garment details and showroom in Ho Chi Minh City.", "/media/2026/09/st-tailor-gallery-showroom-tailoring-display.jpg", "S.T Tailor showroom and tailoring display"],
  [fittingFilmRoute, "FittingFilm.html", "A Fitting in Motion | S.T Tailor Film", galleryFilm.description, galleryFilm.poster, "Client trying on a long black skirt at S.T Tailor | Khách thử chân váy đen dài tại S.T Tailor"],
  ["/bang-gia/", "Pricing.html", "Bespoke Tailoring Prices in HCMC | S.T Tailor", "Review starting prices for bespoke suits, shirts, formalwear and clothing alterations before consulting S.T Tailor in Ho Chi Minh City.", "/media/2026/09/st-tailor-navy-double-breasted-front.jpeg", "Navy double-breasted suit by S.T Tailor"],
  ["/phuong-thuc-thanh-toan/", "Payment.html", "Payment Methods | S.T Tailor HCMC", "Pay S.T Tailor in VND cash, by bank transfer or QR, with international credit/debit cards, or via Apple Pay, Google Pay and Samsung Pay NFC payments.", "/media/2026/06/store-sttailor-2.webp", "S.T Tailor showroom in Ho Chi Minh City"],
  ["/lien-he/", "Contact.html", "Contact S.T Tailor HCMC | Private Consultation", "Contact S.T Tailor by telephone, email, Messenger, Zalo, Instagram or WhatsApp and arrange a private tailoring consultation.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom at 258 Le Thanh Ton"],
  ["/cam-nang-may-do/", "GuideHub.html", "Tailoring Guide in HCMC | S.T Tailor", "Read practical bilingual guidance from S.T Tailor on choosing cloth, fittings, alterations and caring for tailored garments in Ho Chi Minh City.", "/media/2026/09/fabric-focus-swatch-books.jpg", "Tailoring cloth swatches at S.T Tailor"],
  ["/chon-vai-may-do/", "GuideCloth.html", "How to Choose Suit Fabric in HCMC | S.T Tailor", "Choose suit and formalwear cloth by occasion, climate, drape and care with practical bilingual guidance from S.T Tailor in Ho Chi Minh City.", "/media/2026/09/st-tailor-gallery-canonico-cloth-books.jpg", "Vitale Barberis Canonico cloth books at S.T Tailor"],
  ["/quy-trinh-thu-do/", "GuideFitting.html", "Bespoke Fitting Process in HCMC | S.T Tailor", "Understand consultation, measurement, fittings, refinement and handover for a bespoke garment at S.T Tailor in central Ho Chi Minh City.", "/media/2026/09/st-tailor-client-measurement-session.jpg", "Tailor measuring a client during a fitting at S.T Tailor"],
  ["/chinh-sua-trang-phuc/", "GuideAlterations.html", "Clothing Alterations in HCMC | S.T Tailor Guide", "Learn what S.T Tailor assesses before altering trouser hems, waists, jacket sleeves and garment repairs in central Ho Chi Minh City.", "/media/2026/09/st-tailor-gallery-trouser-interior-detail.jpg", "Tailored trouser interior and seam finishing at S.T Tailor"],
  ["/bao-quan-giat-la/", "GuideCare.html", "Suit Care & Garment Cleaning Guide | S.T Tailor", "Follow a practical bilingual guide to airing, brushing, storing, spot care, washing, ironing and professional cleaning for tailored garments.", "/media/2026/09/st-tailor-gallery-jacket-lining-mannequin.jpg", "Tailored jacket lining and construction at S.T Tailor"],
  [clientCareHubRoute, "ClientCare.html", "Client Care for Bespoke Orders | S.T Tailor", "Find out how to pay for, collect, care for or raise a concern about a tailored garment from S.T Tailor in Ho Chi Minh City.", "/media/2026/06/store-sttailor-2.webp", "S.T Tailor showroom for garment collection and aftercare | Showroom S.T Tailor, nơi nhận và chăm sóc trang phục"],
  ["/doi-tra-hoan-tien/", "Returns.html", "Returns & Refunds for Tailored Garments | S.T Tailor", "Read S.T Tailor's bilingual returns and refunds policy for made-to-measure garments, alterations, order concerns, cancellations and refunds.", "/media/2026/09/fabric-focus-cloth-books.jpg", "Tailoring cloth books used when confirming a S.T Tailor order"],
  ["/chinh-sach-van-chuyen/", "Shipping.html", "Shipping & Delivery for Tailored Garments | S.T Tailor", "Explore S.T Tailor's bilingual delivery options for showroom collection, Ho Chi Minh City couriers, Vietnam shipping and international dispatch.", "/media/2026/06/store-sttailor-2.webp", "S.T Tailor showroom for garment collection and handover"],
  ["/dieu-khoan-dieu-kien/", "Terms.html", "Terms & Conditions for Tailoring Orders | S.T Tailor", "Review S.T Tailor's bilingual order terms covering quotations, bespoke fittings, payments, delivery, changes and consumer rights in Vietnam.", "/media/2026/09/fabric-focus-cloth-books.jpg", "S.T Tailor fabric library for bespoke orders"],
  ["/chinh-sach-bao-mat/", "Privacy.html", "Privacy Policy & Client Data | S.T Tailor", "Learn how S.T Tailor handles enquiries, measurements, order details and website analytics, with bilingual privacy information and contact options.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom in Ho Chi Minh City"],
  ...[...tailoringPages, ...showcasePages].map(({ route, source, title, description, image, imageAlt }) => [route, source, title, description, image, imageAlt])
];

const primaryNavigation = [
  ["/gioi-thieu/", "About", "Giới thiệu"],
  ["/dich-vu/", "Services", "Dịch vụ"],
  ["/gallery/", "Gallery", "Thư viện ảnh"],
  ["/bang-gia/", "Pricing", "Bảng giá"],
  ["/lien-he/", "Contact", "Liên hệ"]
];

const guideRoutes = [
  ["/chon-vai-may-do/", "Choosing cloth", "Chọn vải may đo"],
  ["/quy-trinh-thu-do/", "The fitting process", "Quy trình thử đồ"],
  ["/chinh-sua-trang-phuc/", "Clothing alterations", "Chỉnh sửa trang phục"],
  ["/bao-quan-giat-la/", "Garment care and cleaning", "Bảo quản và giặt là"],
  ...tailoringPages.filter(({ source }) => source.startsWith("Guide")).map(({ route, labels }) => [route, ...labels])
];
const serviceRoutes = tailoringPages.filter(({ source }) => source.startsWith("Service"));
const policyRoutes = ["/phuong-thuc-thanh-toan/", "/doi-tra-hoan-tien/", "/chinh-sach-van-chuyen/", "/dieu-khoan-dieu-kien/", "/chinh-sach-bao-mat/"];

const pageLabels = new Map([
  ["/", ["Home", "Trang chủ"]],
  ...primaryNavigation.map(([route, ...labels]) => [route, labels]),
  ...guideRoutes.map(([route, ...labels]) => [route, labels]),
  ...serviceRoutes.map(({ route, labels }) => [route, labels]),
  ...showcasePages.map(({ route, labels }) => [route, labels]),
  [fittingFilmRoute, ["A fitting in motion", "Thử phom qua chuyển động"]],
  ["/phuong-thuc-thanh-toan/", ["Payment methods", "Phương thức thanh toán"]],
  [clientCareHubRoute, ["Client Care overview", "Thông tin chăm sóc khách hàng"]],
  ["/cam-nang-may-do/", ["Tailoring guide", "Cẩm nang may đo"]],
  ["/doi-tra-hoan-tien/", ["Returns and refunds", "Đổi trả và hoàn tiền"]],
  ["/chinh-sach-van-chuyen/", ["Shipping and delivery", "Vận chuyển và giao nhận"]],
  ["/dieu-khoan-dieu-kien/", ["Terms and conditions", "Điều khoản và điều kiện"]],
  ["/chinh-sach-bao-mat/", ["Privacy policy", "Chính sách bảo mật"]]
]);

function breadcrumbTrail(route) {
  if (route === "/") return [];
  const trail = ["/"];
  if (serviceRoutes.some((page) => page.route === route)) trail.push("/dich-vu/");
  if (guideRoutes.some(([guideRoute]) => guideRoute === route)) trail.push("/cam-nang-may-do/");
  if (policyRoutes.includes(route)) trail.push(clientCareHubRoute);
  if (route === fittingFilmRoute) trail.push("/gallery/");
  const parent = route.replace(/[^/]+\/$/, "");
  if (pageLabels.has(parent) && !trail.includes(parent)) trail.push(parent);
  trail.push(route);
  return trail.map((href) => {
    const [english, vietnamese] = pageLabels.get(href);
    return { href, english, vietnamese };
  });
}

function breadcrumbNavigation(trail) {
  if (!trail.length) return "";
  const items = trail.map(({ href, english, vietnamese }, index) => {
    const label = `<span>${english}</span><span lang="vi">${vietnamese}</span>`;
    return index === trail.length - 1
      ? `<li><span class="st-breadcrumb__current" aria-current="page">${label}</span></li>`
      : `<li><a href="${href}">${label}</a></li>`;
  });
  return `<nav class="st-breadcrumb" aria-label="Breadcrumb | Đường dẫn trang"><ol>${items.join("")}</ol></nav>`;
}

function showcaseHubLinks() {
  return `<nav class="st-showcase__shell st-showcase__links st-showcase__links--discovery" aria-label="Finished work | Trang phục và dự án">
    ${showcaseHubs.map(({ route, labels: [english, vietnamese] }) => `<a class="st-showcase__action" href="${route}">${english}<span lang="vi">${vietnamese}</span></a>`).join("\n    ")}
  </nav>`;
}

function transformShowcase(page, html) {
  const { route, labels: [english, vietnamese], heading = english, image, imageAlt, summary, sections } = page;
  if (!summary) {
    const cardHeading = sections ? "h3" : "h2";
    const cards = showcaseItemsFor(route).map(({ route: href, labels: [title, translation], summary: [copy, copyVi], image: src, imageAlt: alt, section }, index) => ({
      section,
      markup: `<article class="st-showcase-card">
      <img class="st-showcase-card__photo" src="${src}" alt="${alt}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
      <div class="st-showcase-card__copy">
        <${cardHeading} id="st-showcase-item-${index + 1}">${title}<span lang="vi">${translation}</span></${cardHeading}>
        <p>${copy}<span lang="vi">${copyVi}</span></p>
        <a class="st-showcase__action" href="${href}" aria-describedby="st-showcase-item-${index + 1}">View details <span lang="vi">Xem chi tiết</span></a>
      </div>
    </article>`
    }));
    const grid = (items) => `<div class="st-showcase__index">${items.map(({ markup }) => markup).join("\n")}</div>`;
    const index = !sections ? grid(cards) : `
      <nav class="st-showcase__sections" aria-label="Garment collections | Nhóm trang phục">
        ${sections.map(({ id, labels: [en, vi] }) => `<a class="st-showcase__action" href="#${id}">${en}<span lang="vi">${vi}</span></a>`).join("\n")}
      </nav>
      ${sections.map(({ id, labels: [en, vi] }) => `<section class="st-showcase__group" aria-labelledby="${id}">
        <h2 id="${id}" tabindex="-1">${en}<span lang="vi">${vi}</span></h2>
        ${grid(cards.filter(({ section }) => section === id))}
      </section>`).join("\n")}`;
    return html.replace("<!-- SHOWCASE_INDEX -->", `<div class="st-showcase__shell">${index}</div>`);
  }
  return html.replace("<!-- SHOWCASE_HERO -->", `<header class="st-showcase__hero">
    <div class="st-showcase__shell st-showcase__hero-grid">
      <div class="st-showcase__lead">
        <h1 id="st-showcase-title">${heading}<span lang="vi">${vietnamese}</span></h1>
        <p>${summary[0]}<span lang="vi">${summary[1]}</span></p>
        <a class="st-showcase__action st-showcase__action--primary" href="/lien-he/">Arrange a consultation<span lang="vi">Đặt lịch tư vấn</span></a>
      </div>
      <figure class="st-showcase__portrait"><img class="st-showcase__hero-image" src="${image}" alt="${imageAlt}" loading="eager" fetchpriority="high"></figure>
    </div>
  </header>`);
}

function readSource(file) {
  return readFileSync(path.join(sourceRoot, file), "utf8")
    // Git can check out the preserved .txt fragments with Windows line endings.
    .replace(/\r\n?/g, "\n")
    .replaceAll("https://sttailor.com/wp-content/uploads/", "/media/")
    .replaceAll("https://sttailor.com/", "/")
    .replace(/https:\/\/(?:cdn\.simpleicons\.org|api\.iconify\.design)\/[^"'\s<>]+/g, (url) => {
      if (!iconPaths[url]) throw new Error(`Unmapped remote icon in ${file}: ${url}`);
      return iconPaths[url];
    });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function elementRange(html, match) {
  const tag = /^<([a-z0-9-]+)/i.exec(match[0])?.[1];
  if (!tag) throw new Error("Could not determine element tag while transforming a WordPress fragment.");
  const matcher = new RegExp(`<\\/?${escapeRegex(tag)}\\b[^>]*>`, "gi");
  matcher.lastIndex = match.index;
  let depth = 0;
  for (let token = matcher.exec(html); token; token = matcher.exec(html)) {
    if (token[0].startsWith("</")) depth -= 1;
    else if (!token[0].endsWith("/>")) depth += 1;
    if (depth === 0) return { start: match.index, end: matcher.lastIndex };
  }
  throw new Error(`Could not find closing </${tag}> while transforming a WordPress fragment.`);
}

function findElementByClass(html, tag, className) {
  const quotedClass = `class=(['"])`;
  const matcher = new RegExp(`<${tag}\\b(?=[^>]*${quotedClass}[^'"]*\\b${escapeRegex(className)}\\b[^'"]*\\1)[^>]*>`, "i");
  const match = matcher.exec(html);
  return match ? elementRange(html, match) : null;
}

function findElementById(html, tag, id) {
  const matcher = new RegExp(`<${tag}\\b(?=[^>]*\\bid=(['"])${escapeRegex(id)}\\1)[^>]*>`, "i");
  const match = matcher.exec(html);
  return match ? elementRange(html, match) : null;
}

function removeElementByClass(html, tag, className) {
  const range = findElementByClass(html, tag, className);
  return range ? `${html.slice(0, range.start)}${html.slice(range.end)}` : html;
}

function removeElementById(html, tag, id) {
  const range = findElementById(html, tag, id);
  return range ? `${html.slice(0, range.start)}${html.slice(range.end)}` : html;
}

function replaceVisibleAtelier(html) {
  return html
    .replaceAll("THE ATELIER, IN FULL", "S.T TAILOR, IN FULL")
    .replaceAll("THE ATELIER LEDGER", "S.T TAILOR PRICING")
    .replaceAll("THE ATELIER GALLERY", "S.T TAILOR GALLERY")
    .replaceAll("ATELIER GALLERY", "TAILORING GALLERY")
    .replaceAll("FOLLOW THE ATELIER", "FOLLOW S.T TAILOR")
    .replaceAll("KẾT NỐI CÙNG ATELIER", "KẾT NỐI CÙNG S.T TAILOR")
    .replaceAll("SỔ BÁO GIÁ ATELIER", "SỔ BÁO GIÁ MAY ĐO")
    .replaceAll("THƯ VIỆN ATELIER", "THƯ VIỆN MAY ĐO")
    .replaceAll("không gian atelier", "không gian may đo")
    .replaceAll("Gặp gỡ atelier", "Gặp gỡ S.T Tailor")
    .replaceAll("Meet the atelier", "Meet S.T Tailor")
    .replaceAll("About the atelier", "About S.T Tailor")
    .replaceAll("contacting the atelier", "contacting S.T Tailor")
    .replaceAll("at the atelier", "at S.T Tailor")
    .replaceAll("in the atelier", "at S.T Tailor")
    .replaceAll("tại atelier", "tại S.T Tailor")
    .replaceAll("The atelier archive", "The S.T Tailor archive")
    .replaceAll("Khoảnh khắc từ atelier", "Khoảnh khắc tại nhà may")
    .replaceAll("tại tiệm", "tại nhà may")
    .replaceAll("TIÊU CHUẨN CỦA ATELIER", "TIÊU CHUẨN MAY ĐO");
}

function transformHome(html) {
  html = html
    .replace('Bespoke tailoring in Ho Chi Minh City<span lang="vi">', 'Bespoke tailoring in <span class="st-home-v6__city">Ho Chi Minh City</span><span lang="vi">')
    .replace("S.T TAILOR / THÀNH PHỐ HỒ CHÍ MINH</span></p>", "S.T TAILOR / TP. HỒ CHÍ MINH</span></p>")
    .replace(
      /<a class="st-home-v6__hero-jump"[^>]*>[\s\S]*?<\/a>/,
      '<a class="st-home-v6__hero-jump" href="/lien-he/"><span>ARRANGE A PRIVATE CONSULTATION</span><span lang="vi">ĐẶT LỊCH TƯ VẤN RIÊNG</span></a>'
    );
  html = removeElementByClass(html, "nav", "st-home-v6__routes");
  html = removeElementByClass(html, "section", "st-home-v6__gallery");
  const destinations = [
    ["/gioi-thieu/", "2026/09/fabric-focus-cloth-books.jpg", "Tailoring cloth books selected at S.T Tailor", "Các sổ vải may đo do S.T Tailor tuyển chọn", "Cloth &amp; craft", "Chất liệu và tay nghề", "Meet the tailors and explore European cloth and Vietnamese silk.", "Gặp gỡ thợ may và tìm hiểu vải châu Âu cùng lụa Việt Nam."],
    ["/dich-vu/", "2026/09/st-tailor-client-fitted-suit.jpg", "Client wearing a fitted suit at S.T Tailor", "Khách mặc bộ suit may vừa vặn tại S.T Tailor", "Tailoring services", "Dịch vụ may đo", "Explore suits, formalwear and alterations, from fitting to finishing.", "Khám phá suit, lễ phục và dịch vụ chỉnh sửa, từ thử đồ đến hoàn thiện."],
    ["/gallery/", "2026/06/store-sttailor-4.webp", "S.T Tailor showroom interior", "Không gian bên trong showroom S.T Tailor", "The gallery", "Thư viện ảnh", "See cloth, fittings, finished garments and details from the showroom.", "Xem chất liệu, buổi thử đồ, trang phục hoàn thiện và những góc của showroom."],
    ["/bang-gia/", "2026/09/st-tailor-navy-double-breasted-front.jpeg", "Front of a navy double-breasted suit by S.T Tailor", "Mặt trước bộ suit xanh navy hai hàng khuy do S.T Tailor may", "Starting prices", "Giá khởi điểm", "Compare starting prices before discussing cloth and design.", "Tham khảo giá khởi điểm trước khi trao đổi về chất liệu và thiết kế."],
    ["/lien-he/", "2026/09/st-tailor-client-private-consultation.jpg", "Tailoring consultation with a client at S.T Tailor", "Buổi tư vấn may đo cùng khách hàng tại S.T Tailor", "Book a consultation", "Đặt lịch tư vấn", "Tell us what you need and when you plan to wear it.", "Chia sẻ nhu cầu và dịp bạn dự định mặc trang phục."]
  ];
  const editorial = `
  <section class="st-home-editorial" aria-labelledby="st-home-editorial-title">
    <div class="st-home-editorial__intro">
      <h2 id="st-home-editorial-title">Explore S.T Tailor <span lang="vi">Khám phá S.T Tailor</span></h2>
      <p>See how we select cloth, fit garments and finish each piece at our Ho Chi Minh City showroom.<span lang="vi">Tìm hiểu cách chúng tôi chọn vải, thử đồ và hoàn thiện từng trang phục tại showroom ở TP. Hồ Chí Minh.</span></p>
    </div>
    <div class="st-home-editorial__grid">
      ${destinations.map(([href, path, alt, altVi, name, nameVi, description, descriptionVi], index) => `<article class="st-home-editorial__frame">
        <img class="st-home-editorial__photo" src="/media/${path}" alt="${alt} / ${altVi}" loading="lazy" decoding="async">
        <div class="st-home-editorial__copy">
          <a class="st-home-editorial__link" href="${href}" aria-describedby="st-home-description-${index + 1}">${name} <span lang="vi">${nameVi}</span></a>
          <p id="st-home-description-${index + 1}">${description}<span lang="vi">${descriptionVi}</span></p>
        </div>
      </article>`).join("\n")}
    </div>
  </section>`;
  const guideStrip = `
  <a class="st-home-guide-strip" href="/cam-nang-may-do/">
    <strong>Cloth · fitting · alterations <small lang="vi">Chất liệu · thử đồ · chỉnh sửa</small></strong>
    <span>OPEN THE GUIDE <small lang="vi">XEM CẨM NANG</small><i aria-hidden="true">→</i></span>
  </a>`;
  return html.replace(/\s*<\/section>\s*$/, `${editorial}${showcaseHubLinks()}${guideStrip}\n</section>`);
}

function transformFooter(html, route) {
  html = removeElementByClass(html, "div", "st-footer-v7__top")
    .replace('loading="eager"', 'loading="lazy"')
    .replaceAll('alt="" aria-hidden="true">', 'alt="" aria-hidden="true" width="20" height="20">')
    .replace(
      '<section class="st-footer-v7__about" aria-labelledby="st-footer-title">',
      '<section class="st-footer-v7__about" aria-labelledby="st-footer-title">\n        <a class="st-footer-v7__crest" href="/" aria-label="S.T Tailor home"><img src="/media/2026/09/logo-sttailor-1000x1024.png" alt="S.T Tailor" width="1000" height="1024" loading="lazy" decoding="async"></a>'
    );
  html = html.replace(/(<nav class="st-footer-v7__social"[\s\S]*?)(<\/nav>)/, `$1<a href="https://www.tripadvisor.com/Attraction_Review-g293925-d34701232-Reviews-S_T_Tailor-Ho_Chi_Minh_City.html" target="_blank" rel="noopener noreferrer"><img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logomark.svg" alt="" aria-hidden="true" width="20" height="20" loading="lazy" decoding="async"><span>Tripadvisor</span></a>$2`);
  if (route === "/lien-he/") {
    // Contact already embeds the same showroom map in its main content.
    html = html.replace(/<iframe\b[^>]*title="S\.T Tailor showroom map"[^>]*><\/iframe>/, "");
  }
  return replaceVisibleAtelier(html);
}

function transformServices(html) {
  html = html.replace('aria-labelledby="st-service-title"', 'aria-labelledby="st-service-commission-map-title"');
  for (const [tag, className] of [
    ["header", "st-service-hero"],
    ["section", "st-service-offerings"],
    ["section", "st-service-brief"],
    ["section", "st-service-process"],
    ["section", "st-service-house-standard"],
    ["section", "st-service-notes"],
    ["section", "st-service-gallery-redirect"],
    ["section", "st-service-commission-map__journey"]
  ]) html = removeElementByClass(html, tag, className);
  const bespokeProcess = `
  <section class="st-bespoke-process" aria-labelledby="st-bespoke-process-title">
    <div class="st-service-shell">
      <header class="st-bespoke-process__head st-motion st-motion-1">
        <p class="st-page-kicker">THE BESPOKE PROCESS <span lang="vi">/ QUY TRÌNH MAY ĐO</span></p>
        <h2 id="st-bespoke-process-title">From conversation to a garment that belongs to you.<span lang="vi">Từ cuộc trò chuyện đến trang phục thực sự thuộc về bạn.</span></h2>
        <p>Five considered stages keep proportion, cloth and purpose aligned from the first appointment to the final handover.<span lang="vi">Năm giai đoạn được chăm chút để phom dáng, chất liệu và mục đích sử dụng luôn nhất quán từ buổi hẹn đầu tiên đến khi bàn giao.</span></p>
      </header>
      <ol class="st-bespoke-process__steps">
        <li class="st-motion st-motion-1"><span class="st-bespoke-process__number">01</span><div><h3>Private consultation<span lang="vi">Tư vấn riêng</span></h3><p>We begin with the occasion, your wardrobe and how the garment should feel in motion.<span lang="vi">Bắt đầu từ dịp sử dụng, tủ đồ và cảm giác bạn mong muốn khi vận động.</span></p></div></li>
        <li class="st-motion st-motion-2"><span class="st-bespoke-process__number">02</span><div><h3>Cloth &amp; design<span lang="vi">Chọn vải &amp; thiết kế</span></h3><p>Weight, drape, colour and construction are compared in person before the brief is confirmed.<span lang="vi">Trọng lượng, độ rũ, màu sắc và kết cấu được so sánh trực tiếp trước khi chốt phương án.</span></p></div></li>
        <li class="st-motion st-motion-3"><span class="st-bespoke-process__number">03</span><div><h3>Measure &amp; pattern<span lang="vi">Lấy số đo &amp; dựng phom</span></h3><p>Measurements, posture and proportion guide an individual pattern shaped around the wearer.<span lang="vi">Số đo, tư thế và tỷ lệ cơ thể định hướng bộ rập riêng dành cho người mặc.</span></p></div></li>
        <li class="st-motion st-motion-4"><span class="st-bespoke-process__number">04</span><div><h3>Fittings &amp; refinement<span lang="vi">Thử đồ &amp; tinh chỉnh</span></h3><p>Balance, comfort and movement are reviewed through fitting, then resolved in the finishing details.<span lang="vi">Độ cân đối, thoải mái và chuyển động được kiểm tra qua thử đồ rồi hoàn thiện ở từng chi tiết.</span></p></div></li>
        <li class="st-motion st-motion-5"><span class="st-bespoke-process__number">05</span><div><h3>Handover &amp; care<span lang="vi">Bàn giao &amp; chăm sóc</span></h3><p>The finished garment is inspected and pressed, with practical guidance for wearing and care.<span lang="vi">Trang phục được kiểm tra, là hoàn thiện và hướng dẫn sử dụng, bảo quản phù hợp.</span></p></div></li>
      </ol>
      <div class="st-bespoke-process__actions"><a href="/lien-he/">ARRANGE A CONSULTATION <span aria-hidden="true">/</span> <span lang="vi">ĐẶT LỊCH TƯ VẤN</span></a><a href="/bang-gia/">VIEW STARTING PRICES <span aria-hidden="true">/</span> <span lang="vi">XEM BẢNG GIÁ</span></a><a href="/cam-nang-may-do/">READ THE TAILORING GUIDE <span aria-hidden="true">/</span> <span lang="vi">XEM CẨM NANG MAY ĐO</span></a></div>
    </div>
  </section>`;
  html = html.replace('  <aside class="st-service-booking"', `${bespokeProcess}\n${showcaseHubLinks()}\n  <aside class="st-service-booking"`);
  return replaceVisibleAtelier(html);
}

function transformPricing(html) {
  html = removeElementByClass(html, "header", "stpr-hero")
    .replace(/<h2 id="stpr-priceboard-title">([\s\S]*?)<\/h2>/, '<h1 id="stpr-priceboard-title">$1</h1>')
    .replace(/\s*<p>Each starting price is a guide[\s\S]*?<\/p>/, "")
    .replace("THE ATELIER GALLERY <span lang=\"vi\">THƯ VIỆN ATELIER</span>", "PRIVATE CONSULTATION <span lang=\"vi\">TƯ VẤN VÀ BÁO GIÁ</span>")
    .replace("See the references behind each commission.<span lang=\"vi\">Khám phá cảm hứng phía sau mỗi đơn may.</span>", "Let us prepare your quotation.<span lang=\"vi\">Nhận tư vấn và báo giá.</span>")
    .replace("Explore tailoring, cloth and finished work before a conversation.<span lang=\"vi\">Khám phá may đo, chất liệu và sản phẩm hoàn thiện trước khi trao đổi.</span>", "Discuss cloth, design and timing with S.T Tailor before your order is confirmed.<span lang=\"vi\">Trao đổi chất liệu, thiết kế và thời gian cùng S.T Tailor trước khi xác nhận đơn hàng.</span>")
    .replace(/href="https:\/\/sttailor\.com\/gallery\/"/, 'href="/lien-he/"')
    .replace(/EXPLORE THE GALLERY[\s\S]*?<\/a>/, 'BOOK A CONSULTATION <span lang="vi">ĐẶT LỊCH TƯ VẤN</span></a>');
  html = removeElementByClass(html, "section", "stpr-notes");
  html = removeElementByClass(html, "section", "stpr-cta");
  const gallerySuite = `
  <section class="st-pricing-gallery-suite" aria-labelledby="st-pricing-gallery-suite-title">
    <a class="st-pricing-gallery-suite__frame" href="/gallery/" aria-describedby="st-pricing-gallery-suite-description">
      <span class="st-pricing-gallery-suite__copy st-motion st-motion-1">
        <small>FROM CLOTH TO FINISH <span lang="vi">TỪ CHẤT LIỆU ĐẾN HOÀN THIỆN</span></small>
        <strong id="st-pricing-gallery-suite-title">Read the price. See the craft.<span lang="vi">Xem mức giá. Khám phá tay nghề.</span></strong>
        <span id="st-pricing-gallery-suite-description">VIEW THE GALLERY <b lang="vi">XEM THƯ VIỆN HÌNH ẢNH</b><i aria-hidden="true">→</i></span>
      </span>
      <span class="st-pricing-gallery-suite__media">
        <figure class="st-motion st-motion-2"><img src="/media/2026/09/st-tailor-gallery-canonico-cloth-books.jpg" alt="Vitale Barberis Canonico cloth books at S.T Tailor | Bộ mẫu vải Vitale Barberis Canonico tại S.T Tailor" width="3024" height="4032" loading="lazy" decoding="async"></figure>
        <figure class="st-motion st-motion-3"><img src="/media/2026/09/st-tailor-gallery-shoulder-lapel-detail.jpg" alt="Tailored grey jacket shoulder and lapel detail | Chi tiết vai và ve áo khoác xám may đo" width="1152" height="1440" loading="lazy" decoding="async"></figure>
      </span>
    </a>
  </section>`;
  html = html.replace(/\s*<\/section>\s*$/, `${gallerySuite}\n</section>`);
  return replaceVisibleAtelier(html);
}

function transformContact(html) {
  html = removeElementByClass(html, "section", "st-contact-hero")
    .replace(/\s*<section class="st-contact-gallery-redirect"[\s\S]*?<\/section>/, "")
    .replace(/\s*<div class="st-contact-line small"><\/div>/, "")
    .replace(
      '<h2>CONTACT DETAILS<br><span lang="vi">THÔNG TIN LIÊN HỆ</span></h2>',
      '<h1>CONTACT DETAILS<br><span lang="vi">THÔNG TIN LIÊN HỆ</span></h1>'
    );
  return replaceVisibleAtelier(html);
}

const franceClientPhotos = [
  ["st-tailor-red-waistcoat-bouquet-back.jpg", "Red patterned waistcoat with a bouquet over the shoulder", "Áo gile đỏ họa tiết cùng bó hoa trên vai"],
  ["st-tailor-red-waistcoat-side-profile.jpg", "Side profile of the red waistcoat, white shirt and bouquet", "Góc nghiêng áo gile đỏ, sơ mi trắng và bó hoa"],
  ["st-tailor-red-waistcoat-full-length.jpg", "Back view of the red waistcoat and blue-grey trousers", "Áo gile đỏ và quần xanh xám nhìn từ phía sau"],
  ["st-tailor-red-waistcoat-marina-evening.jpg", "Red waistcoat and jacket carried beside the marina at night", "Áo gile đỏ cùng áo khoác cầm tay bên bến du thuyền về đêm"],
  ["st-tailor-red-waistcoat-turning-view.jpg", "Turning view showing the red waistcoat and adjustable back strap", "Góc xoay người thể hiện áo gile đỏ và đai điều chỉnh phía sau"],
  ["st-tailor-red-waistcoat-bouquet-marina.jpg", "Red waistcoat and flowers against the illuminated marina", "Áo gile đỏ và bó hoa bên bến du thuyền lên đèn"]
];

const galleryAltText = {
  "background-hero-trang-lien-he-sttailor.webp": "Tailor checking the shoulder and lapel of a navy suit on a client at S.T Tailor | Thợ may kiểm tra vai và ve áo suit xanh navy trên người khách tại S.T Tailor",
  ...Object.fromEntries(franceClientPhotos.map(([file, en, vi]) => [file, `${en} | ${vi}`])),
  "st-tailor-made-to-measure-stories-gallery.jpg": "S.T Tailor made-to-measure story with a client and navy jacket | Câu chuyện may đo S.T Tailor với khách hàng và áo khoác xanh navy",
  "st-tailor-gallery-brocade-dinner-jacket.jpg": "Black textured dinner jacket on a mannequin | Áo khoác dự tiệc đen dệt vân trên mannequin",
  "st-tailor-gallery-ceremonial-jacket-frame.jpg": "Burgundy ceremonial jacket with gold embroidery | Áo lễ phục đỏ burgundy thêu chỉ vàng",
  "st-tailor-gallery-duk-0010.jpg": "Black tuxedo with white shirt on a mannequin | Tuxedo đen cùng sơ mi trắng trên mannequin",
  "st-tailor-gallery-duk-0012.jpg": "Black tuxedo with tailored satin lapel | Tuxedo đen với ve satin may đo",
  "st-tailor-gallery-duk-9733.jpg": "Black formal trousers and white pleated shirt | Quần lễ phục đen và sơ mi trắng xếp ly",
  "sttailorhcm_3971189422263494295.jpg": "Black pinstripe suit with red lining detail | Suit sọc đen với chi tiết lớp lót đỏ",
  "sttailorhcm_3971191631789221081.jpg": "Navy suit displayed on a mannequin | Suit xanh navy trưng bày trên mannequin",
  "st-tailor-gallery-client-charcoal-suit.jpg": "Client wearing a charcoal tailored suit in the showroom | Khách hàng mặc suit xám than may đo tại showroom",
  "st-tailor-gallery-navy-formal-front.jpg": "Client in a navy formal suit, front view | Khách hàng mặc suit lễ phục xanh navy, góc chính diện",
  "st-tailor-archive-navy-formal-back.jpg": "Client in a navy formal suit, back view | Khách hàng mặc suit lễ phục xanh navy, góc phía sau",
  "st-tailor-archive-navy-formal-profile.jpg": "Client in a navy formal suit, side profile | Khách hàng mặc suit lễ phục xanh navy, góc nghiêng",
  "st-tailor-navy-double-breasted-front.jpeg": "Navy double-breasted suit on a mannequin | Suit xanh navy hai hàng nút trên mannequin",
  "st-tailor-archive-atelier-one.jpg": "Navy tailored suit on a mannequin by the coast | Suit xanh navy may đo trên mannequin bên bờ biển",
  "st-tailor-archive-atelier-two.jpg": "Grey double-breasted suit in a tailoring room | Suit xám hai hàng nút trong không gian nhà may",
  "st-tailor-gallery-grey-suit.jpg": "Grey tailored suit on a mannequin by a window | Suit xám may đo trên mannequin cạnh cửa sổ",
  "st-tailor-gallery-beige-double-breasted-suit.png": "Cream double-breasted suit on a mannequin | Suit kem hai hàng nút trên mannequin",
  "st-tailor-gallery-gray-double-breasted-suit.png": "Light grey double-breasted suit on a mannequin | Suit xám nhạt hai hàng nút trên mannequin",
  "st-tailor-gallery-navy-suit-mannequin.png": "Navy double-breasted suit on a mannequin | Suit xanh navy hai hàng nút trên mannequin",
  "st-tailor-gallery-navy-suit-mannequin-editorial.jpg": "Navy blazer with patterned tie and pocket square | Blazer xanh navy với cà vạt hoa văn và khăn túi áo",
  "st-tailor-black-suit-full-length.jpeg": "Black tailored suit, full length | Suit đen may đo, toàn thân",
  "st-tailor-navy-lapel-detail.jpeg": "Navy double-breasted suit lapel detail | Chi tiết ve áo suit xanh navy hai hàng nút",
  "st-tailor-gallery-duk-9988.jpg": "Light blue tailored suit on a mannequin | Suit xanh nhạt may đo trên mannequin",
  "st-tailor-gallery-duk-9991.jpg": "Lilac tailored suit on a mannequin | Suit tông lilac may đo trên mannequin",
  "st-tailor-gallery-duk-9858.jpg": "Cream tailored suit with light blue shirt | Suit màu kem may đo cùng sơ mi xanh nhạt",
  "st-tailor-womens-white-suit.jpg": "White women's tailored suit on a mannequin | Suit nữ trắng may đo trên mannequin",
  "st-tailor-client-womens-white-suit.jpg": "Client wearing a white women's tailored suit outdoors | Khách hàng mặc suit nữ trắng may đo ngoài trời",
  "st-tailor-client-womens-fitting.jpg": "Women's trouser fitting in the showroom | Buổi thử quần nữ tại showroom",
  "st-tailor-archive-womens-suit-window.jpg": "White women's suit on a mannequin by the window | Suit nữ trắng trên mannequin cạnh cửa sổ",
  "st-tailor-gallery-womenswear-window-frame.jpg": "Floral womenswear displayed in the showroom window | Trang phục nữ họa tiết hoa trưng bày tại cửa sổ showroom",
  "st-tailor-gallery-blush-silk-floral-dress.jpg": "Blush silk dress with floral embroidery | Đầm lụa hồng phấn thêu hoa",
  "st-tailor-magenta-floral-wrap-dress-and-navy-suit.jpg": "Magenta floral wrap dress beside a navy suit on showroom mannequins | Trang phục nữ hoa hồng tím bên cạnh suit xanh navy trên mannequin tại showroom",
  "st-tailor-magenta-floral-wrap-dress-full-length.jpg": "Full-length magenta floral wrap dress with tied waist | Trang phục nữ hoa hồng tím toàn thân với đai buộc eo",
  "st-tailor-magenta-floral-wrap-dress-detail.jpg": "Magenta and violet floral pattern and wrap-front dress detail | Họa tiết hoa hồng tím và chi tiết thân trước kiểu quấn",
  "st-tailor-floral-dinner-jacket-showroom.png": "Magenta and violet floral evening jacket in the S.T Tailor showroom | Áo khoác dự tiệc họa tiết hoa hồng tím tại showroom S.T Tailor",
  "st-tailor-floral-dinner-jacket-lapel.png": "Floral evening jacket lapel and cloth detail | Chi tiết ve áo và chất vải của áo khoác dự tiệc họa tiết hoa",
  "st-tailor-floral-dinner-jacket-front.png": "Floral evening jacket front and pocket detail | Chi tiết thân trước và túi áo khoác dự tiệc họa tiết hoa",
  "st-tailor-floral-dinner-jacket-texture.jpg": "Magenta and violet floral jacquard and pocket detail on an evening jacket | Chi tiết vải jacquard hoa hồng tím và túi áo khoác dự tiệc",
  "st-tailor-gallery-shirt-label-detail.jpg": "S.T Tailor shirt label sewn inside a white shirt | Nhãn S.T Tailor may bên trong sơ mi trắng",
  "st-tailor-gallery-patterned-shirt.jpg": "Blue patterned tailored shirt on a mannequin | Sơ mi xanh hoa văn may đo trên mannequin",
  "tailored-trouser-check.jpg": "Grey checked tailored trousers folded on wood | Quần may đo caro xám gấp trên nền gỗ",
  "st-tailor-archive-occasion-editorial.jpg": "Tailoring consultation editorial with white shirt and navy suit | Hình ảnh tư vấn may đo với sơ mi trắng và suit navy",
  "st-tailor-gallery-duk-9905.jpg": "White tailored shirt folded on navy cloth | Sơ mi trắng may đo gấp trên nền vải navy",
  "st-tailor-gallery-duk-9907.jpg": "White tailored shirt with checked inner collar detail | Sơ mi trắng may đo với chi tiết cổ trong caro",
  "st-tailor-gallery-duk-9908.jpg": "White tailored shirt cuff with checked trim | Cổ tay sơ mi trắng may đo với viền caro",
  "st-tailor-gallery-duk-9910.jpg": "White tailored shirt collar with checked trim | Cổ sơ mi trắng may đo với viền caro",
  "st-tailor-gallery-duk-9913.jpg": "White tailored shirt front with checked placket detail | Thân trước sơ mi trắng may đo với nẹp caro",
  "st-tailor-gallery-duk-9920.jpg": "Light blue tailored trousers folded on white cloth | Quần xanh nhạt may đo gấp trên nền trắng",
  "st-tailor-gallery-duk-9926.jpg": "Black tailored trouser interior and waistband detail | Chi tiết cạp và mặt trong quần đen may đo",
  "st-tailor-gallery-shoulder-lapel-detail.jpg": "Grey suit shoulder and notch lapel detail | Chi tiết vai và ve chữ K của suit xám",
  "navy-notch-lapel.jpg": "Navy blazer with notch lapel and yellow pocket square | Blazer xanh navy với ve chữ K và khăn túi vàng",
  "navy-suit-construction.jpeg": "Navy suit showing front, side, back and lapel views | Suit xanh navy với các góc chính diện, nghiêng, sau và ve áo",
  "st-tailor-archive-gold-jacket-detail.jpg": "Client opening a jacket to show gold lining | Khách hàng mở áo khoác để thể hiện lớp lót vàng",
  "st-tailor-archive-atelier-three.jpg": "Grey patterned jacket on a mannequin in the tailoring room | Áo khoác xám họa tiết trên mannequin trong không gian nhà may",
  "st-tailor-gallery-jacket-lining-mannequin.jpg": "Open tailored jacket showing patterned lining and inner labels | Áo khoác may đo mở thân, thể hiện lớp lót hoa văn và nhãn bên trong",
  "fabric-focus-swatch-books.jpg": "Tailoring swatch books with blue and red cloth samples | Sách mẫu vải may đo với các mẫu xanh navy và đỏ",
  "fabric-focus-catalogue.jpg": "Tailoring cloth catalogue and blue fabric book | Catalogue chất liệu may đo và sổ vải xanh",
  "fabric-focus-colour-reference.jpg": "Cloth colour reference book with fabric swatches | Sổ tham khảo màu vải cùng các mẫu vải",
  "fabric-focus-standing-book.jpg": "Standing tailoring cloth book with navy swatches | Sổ vải may đo dựng đứng cùng mẫu vải navy",
  "fabric-focus-cloth-books.jpg": "Tailoring cloth books and grey swatches | Sách vải may đo và các mẫu vải xám",
  "st-tailor-suiting-fabric-swatches.jpeg": "Suiting fabric swatches in neutral tones | Mẫu vải suit tông trung tính",
  "st-tailor-client-fabric-consultation.jpg": "Client reviewing cloth samples during a consultation | Khách hàng xem mẫu vải trong buổi tư vấn",
  "st-tailor-gallery-trouser-interior-detail.jpg": "Tailored trouser interior with seam finishing | Mặt trong quần may đo với đường hoàn thiện",
  "st-tailor-archive-jacket-lining-one.jpg": "Grey jacket lining with yellow seam tape | Lớp lót áo khoác xám với viền chỉ vàng",
  "st-tailor-archive-jacket-lining-two.jpg": "Grey jacket lining and inner label detail | Chi tiết lớp lót và nhãn bên trong áo khoác xám",
  "st-tailor-gallery-canonico-cloth-books.jpg": "Vitale Barberis Canonico cloth books at S.T Tailor | Sách vải Vitale Barberis Canonico tại S.T Tailor",
  "st-tailor-fabric-books.jpeg": "Stacked suiting fabric books from Italian mills | Chồng sổ vải suit từ các nhà dệt Ý",
  "st-tailor-client-fitted-suit.jpg": "Client wearing a fitted black suit with yellow shirt | Khách hàng mặc suit đen vừa vặn cùng sơ mi vàng",
  "st-tailor-client-fitting-suit-back.jpg": "Back view during a black suit fitting | Góc phía sau trong buổi thử suit đen",
  "st-tailor-client-measurement-session.jpg": "Tailor measuring a client during a fitting session | Thợ may lấy số đo khách hàng trong buổi thử đồ",
  "st-tailor-client-navy-suit-fitting.jpg": "Client receiving a navy suit fitting adjustment | Khách hàng được chỉnh phom suit xanh navy",
  "st-tailor-client-shirt-trouser-fitting.jpg": "Client trying a white shirt and black trousers | Khách hàng thử sơ mi trắng và quần đen",
  "st-tailor-client-shoulder-fitting.jpg": "Tailor adjusting a client's shirt shoulder | Thợ may chỉnh vai áo sơ mi cho khách hàng",
  "st-tailor-owner-client-white-suit.jpg": "S.T Tailor with a client in a white suit | S.T Tailor cùng khách hàng mặc suit trắng",
  "st-tailor-client-portrait-appointment.jpg": "Client portrait in white shirt and black trousers | Chân dung khách hàng với sơ mi trắng và quần đen",
  "st-tailor-client-private-consultation.jpg": "Private consultation with two S.T Tailor clients | Buổi tư vấn riêng cùng hai khách hàng S.T Tailor",
  "st-tailor-archive-gold-jacket-fitting.jpg": "Client wearing a black suit with gold shirt during fitting | Khách hàng mặc suit đen cùng sơ mi vàng trong buổi thử đồ",
  "st-tailor-gallery-client-white-jacket.jpg": "Client wearing a white dinner jacket at the showroom entrance | Khách hàng mặc áo khoác dự tiệc trắng tại lối vào showroom",
  "st-tailor-client-handshake.jpg": "S.T Tailor client appointment handshake | Bắt tay trong buổi hẹn cùng khách hàng S.T Tailor",
  "st-tailor-gallery-duk-9807.jpg": "Client in a blue suit seated in the showroom | Khách hàng mặc suit xanh ngồi tại showroom",
  "store-sttailor-1.webp": "S.T Tailor reception and logo wall | Quầy tiếp đón và tường logo S.T Tailor",
  "store-sttailor-2.webp": "S.T Tailor showroom with garments and fitting area | Showroom S.T Tailor với trang phục và khu thử đồ",
  "store-sttailor-3.webp": "Tailored suit and mannequins in the S.T Tailor showroom | Suit may đo và mannequin trong showroom S.T Tailor",
  "store-sttailor-4.webp": "S.T Tailor lounge with display shelving | Góc tiếp khách S.T Tailor với kệ trưng bày",
  "st-tailor-showroom-interior-wide.jpeg": "Wide view of the S.T Tailor showroom | Góc nhìn rộng không gian showroom S.T Tailor",
  "st-tailor-gallery-wardrobe-rail.jpg": "Tailored garments on a showroom wardrobe rail | Trang phục may đo trên giá treo tại showroom",
  "st-tailor-gallery-storefront-details-night.jpg": "S.T Tailor storefront detail at night | Chi tiết mặt tiền S.T Tailor về đêm",
  "st-tailor-gallery-bespoke-sign-evening.jpg": "Bespoke tailoring sign outside S.T Tailor at night | Biển hiệu may đo riêng của S.T Tailor về đêm",
  "st-tailor-gallery-window-display-evening.jpg": "S.T Tailor window display in the evening | Tủ trưng bày S.T Tailor vào buổi tối",
  "st-tailor-gallery-cloth-wall-evening.jpg": "Showroom aisle with fabric and garments in the evening | Lối đi showroom với vải và trang phục vào buổi tối",
  "st-tailor-showroom-exterior-evening.jpg": "S.T Tailor illuminated upper-storey storefront at night | Mặt tiền S.T Tailor tầng trên khi lên đèn vào buổi tối",
  "st-tailor-gallery-showroom-tailoring-display.jpg": "Tailoring display with suit and dress forms at S.T Tailor | Khu trưng bày may đo với suit và mannequin tại S.T Tailor",
  "st-tailor-garment-rack.jpeg": "Garments on a showroom rail | Trang phục trên giá treo tại showroom",
  "st-tailor-gallery-duk-0058.jpg": "S.T Tailor showroom interior with garments on display | Không gian S.T Tailor với trang phục trưng bày",
  "st-tailor-gallery-duk-0038.jpg": "Tailoring accessories displayed on a shelf | Phụ kiện may đo trưng bày trên kệ",
  "st-tailor-gallery-duk-0064.jpg": "S.T Tailor showroom interior with garment rail | Không gian S.T Tailor với giá treo trang phục",
  "st-tailor-archive-founder-one.jpeg": "Brown tailored trouser cuff with leather shoes | Gấu quần nâu may đo cùng giày da",
  "st-tailor-archive-founder-two.jpeg": "Tailored jacket, tie and lapel pin detail | Chi tiết áo khoác may đo, cà vạt và ghim ve áo",
  "st-tailor-archive-founder-three.jpeg": "Brown tailored suit shoulder and lapel detail | Chi tiết vai và ve áo suit nâu may đo",
  "st-tailor-archive-founder-four.jpeg": "Man in a taupe suit looking down at cloth swatches in the showroom | Người mặc suit nâu xám cúi xem mẫu vải tại nhà may",
  "st-tailor-archive-founder-five.jpeg": "Watch and measuring tape during a tailoring appointment | Đồng hồ và thước dây trong buổi hẹn may đo",
  "st-tailor-archive-founder-six.jpeg": "Portrait of a client in a brown tailored suit | Chân dung khách hàng trong suit nâu may đo",
  "st-tailor-archive-founder-seven.jpeg": "Man in a taupe suit looking ahead while holding cloth swatches and a measuring tape | Người mặc suit nâu xám nhìn về phía trước, tay cầm mẫu vải và thước dây",
  "st-tailor-archive-atelier-four.jpg": "Red patterned jacket lining and S.T Tailor label | Lớp lót áo khoác đỏ hoa văn và nhãn S.T Tailor",
  "st-tailor-gallery-partner-certificate.jpg": "Official partner certificate displayed at S.T Tailor | Chứng nhận đối tác chính thức trưng bày tại S.T Tailor",
  "st-tailor-gallery-singer-feedback-one.jpg": "Client feedback portrait at S.T Tailor | Chân dung khách hàng phản hồi tại S.T Tailor",
  "st-tailor-gallery-singer-feedback-two.jpg": "Client feedback moment at S.T Tailor | Khoảnh khắc phản hồi của khách hàng tại S.T Tailor",
  "st-tailor-gallery-international-client-one.jpg": "International client appointment at S.T Tailor | Buổi hẹn cùng khách hàng quốc tế tại S.T Tailor",
  "st-tailor-gallery-international-client-two.jpg": "International client receiving a garment at S.T Tailor | Khách hàng quốc tế nhận trang phục tại S.T Tailor",
  "mr-Thinh.webp": "Client portrait in a black tailored suit | Chân dung khách hàng trong suit đen may đo",
  "mr-Son.webp": "Client portrait in a navy tailored suit | Chân dung khách hàng trong suit xanh navy may đo"
};

function applyGalleryAltText(html) {
  const unmatched = new Set();
  const rendered = html.replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi, (tag, src) => {
    const filename = src.split("/").pop();
    const alt = galleryAltText[filename];
    if (!alt) {
      unmatched.add(filename);
      return tag;
    }
    return tag.replace(/\s+alt=("|')[\s\S]*?\1/i, "").replace(/\/?>(?=$)/, ` alt="${alt}">`);
  });
  if (unmatched.size) throw new Error(`Gallery images are missing verified alt text: ${[...unmatched].join(", ")}`);
  return rendered;
}

function figureForAsset(html, filename) {
  const matcher = new RegExp(`<figure\\b[^>]*>(?:(?!<\\/figure>)[\\s\\S])*?${escapeRegex(filename)}(?:(?!<\\/figure>)[\\s\\S])*?<\\/figure>`, "i");
  const match = matcher.exec(html);
  if (!match) throw new Error(`Gallery asset was not found in the WordPress reference: ${filename}`);
  return match[0];
}

function appendToGalleryAlbum(html, id, figure) {
  const albumRange = findElementById(html, "section", id);
  if (!albumRange) throw new Error(`Gallery album was not found: ${id}`);
  const album = html.slice(albumRange.start, albumRange.end);
  const gridRange = findElementByClass(album, "div", "st-album-grid");
  if (!gridRange) throw new Error(`Gallery album grid was not found: ${id}`);
  const at = albumRange.start + gridRange.end - "</div>".length;
  return `${html.slice(0, at)}${figure}${html.slice(at)}`;
}

function fittingFilmPlayer(descriptionId, { lazy = false } = {}) {
  return `<video controls playsinline preload="none"${lazy ? ' loading="lazy"' : ""} width="720" height="1280" poster="${galleryFilm.poster}" aria-describedby="${descriptionId}">
      <source src="${galleryFilm.src}" type="video/mp4">
      <a href="${galleryFilm.src}">Watch the fitting film <span lang="vi">/ Xem video thử đồ</span></a>
    </video>`;
}

function transformGallery(html) {
  html = html.replace(
    /<p>Eleven albums gather tailoring[\s\S]*?<\/p>/,
    '<p>Nine albums trace the work of S.T Tailor, from cloth and construction to fittings, client portraits and the rooms where we work.<span lang="vi">Chín album giới thiệu công việc tại S.T Tailor, từ chất liệu và kỹ thuật may đến các buổi thử đồ, chân dung khách hàng và không gian nhà may.</span></p>'
  );
  const archiveRange = findElementById(html, "section", "album-archive");
  const feedbackRange = findElementById(html, "section", "album-client-feedback");
  if (!archiveRange || !feedbackRange) throw new Error("Expected WordPress gallery albums are missing.");
  const archive = html.slice(archiveRange.start, archiveRange.end);
  const feedback = html.slice(feedbackRange.start, feedbackRange.end);
  const archiveDetail = figureForAsset(archive, "st-tailor-archive-atelier-four.jpg");
  const archiveFabric = figureForAsset(archive, "st-tailor-gallery-partner-certificate.jpg");
  const archivePlacement = [
    ["st-tailor-archive-founder-one.jpeg", "album-shirts-trousers"],
    ["st-tailor-archive-founder-two.jpeg", "album-jacket-craft"],
    ["st-tailor-archive-founder-three.jpeg", "album-jacket-craft"],
    ["st-tailor-archive-founder-four.jpeg", "album-suits"],
    ["st-tailor-archive-founder-five.jpeg", "album-appointments"],
    ["st-tailor-archive-founder-six.jpeg", "album-appointments"],
    ["st-tailor-archive-founder-seven.jpeg", "album-appointments"]
  ];
  const feedbackFigures = [...feedback.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi)].map((match) => match[0]);
  for (const [asset, album] of archivePlacement) html = appendToGalleryAlbum(html, album, figureForAsset(archive, asset));
  html = appendToGalleryAlbum(html, "album-jacket-craft", archiveDetail);
  html = appendToGalleryAlbum(html, "album-cloth", archiveFabric);
  for (const figure of feedbackFigures) html = appendToGalleryAlbum(html, "album-appointments", figure);
  html = removeElementById(html, "section", "album-archive");
  html = removeElementById(html, "section", "album-client-feedback");
  // Keep the existing deep links and let the browser focus the named album.
  html = html.replace(/(<section\b[^>]*\bid="album-[\w-]+")>/g, '$1 tabindex="-1">');
  const evening = findElementById(html, "section", "album-tuxedo");
  const eveningGrid = evening && findElementByClass(html.slice(evening.start, evening.end), "div", "st-album-grid");
  if (!eveningGrid) throw new Error("Evening gallery grid was not found for the client photographs.");
  const series = `<section class="st-gallery-client-series" aria-labelledby="st-gallery-client-series-title"><h3 id="st-gallery-client-series-title">Red waistcoat, after dark.<span lang="vi">Áo gile đỏ trong khung cảnh đêm.</span></h3><div class="st-gallery-client-series__grid">${franceClientPhotos.map(([file, en, vi]) => `<figure class="st-gallery-client-series__card"><img src="/media/2026/10/${file}" alt="" loading="lazy" decoding="async"><figcaption>${en}<span lang="vi">${vi}</span></figcaption></figure>`).join("")}</div></section>`;
  const seriesInsertAt = evening.start + eveningGrid.end;
  html = `${html.slice(0, seriesInsertAt)}${series}${html.slice(seriesInsertAt)}`;
  const galleryIndex = `
<section class="st-gallery-numpad" aria-labelledby="st-gallery-numpad-title">
  <div class="st-gallery-shell">
    <header class="st-gallery-numpad__heading st-motion st-motion-1">
      <p class="st-gallery-kicker">THE HOUSE IN NINE FRAMES <span lang="vi">/ NHÀ MAY TRONG CHÍN KHUNG HÌNH</span></p>
      <h2 id="st-gallery-numpad-title">Move through the house.<span lang="vi">Đi qua từng lát cắt của nhà may.</span></h2>
      <p>Choose a chapter below to move directly to the photographs, cloth and fittings that define S.T Tailor.<span lang="vi">Chọn một chương để đi thẳng đến những hình ảnh, chất liệu và buổi thử đồ làm nên S.T Tailor.</span></p>
    </header>
    <nav class="st-gallery-numpad__grid" aria-label="Gallery chapters">
      <a href="#album-tuxedo" class="st-gallery-numpad__card st-motion st-motion-1"><span>01</span><strong>Evening tailoring</strong><em lang="vi">Lễ phục</em><i>↗</i></a>
      <a href="#album-suits" class="st-gallery-numpad__card st-motion st-motion-2"><span>02</span><strong>Suits &amp; blazers</strong><em lang="vi">Suit &amp; blazer</em><i>↗</i></a>
      <a href="#album-womenswear" class="st-gallery-numpad__card st-motion st-motion-3"><span>03</span><strong>Womenswear</strong><em lang="vi">Trang phục nữ</em><i>↗</i></a>
      <a href="#album-shirts-trousers" class="st-gallery-numpad__card st-motion st-motion-2"><span>04</span><strong>Shirts &amp; trousers</strong><em lang="vi">Sơ mi &amp; quần</em><i>↗</i></a>
      <a href="#album-jacket-craft" class="st-gallery-numpad__card st-motion st-motion-3"><span>05</span><strong>Jacket craft</strong><em lang="vi">Kỹ nghệ áo khoác</em><i>↗</i></a>
      <a href="#album-cloth" class="st-gallery-numpad__card st-motion st-motion-4"><span>06</span><strong>The cloth library</strong><em lang="vi">Thư viện chất liệu</em><i>↗</i></a>
      <a href="#album-fitting" class="st-gallery-numpad__card st-motion st-motion-3"><span>07</span><strong>The fitting room</strong><em lang="vi">Phòng thử đồ</em><i>↗</i></a>
      <a href="#album-appointments" class="st-gallery-numpad__card st-motion st-motion-4"><span>08</span><strong>People &amp; appointments</strong><em lang="vi">Con người &amp; lịch hẹn</em><i>↗</i></a>
      <a href="#album-showroom" class="st-gallery-numpad__card st-motion st-motion-5"><span>09</span><strong>The showroom</strong><em lang="vi">Không gian nhà may</em><i>↗</i></a>
    </nav>
  </div>
</section>${showcaseHubLinks()}`;
  html = html.replace(/<section\s+aria-labelledby="album-tuxedo-title"/, `${galleryIndex}\n<section aria-labelledby="album-tuxedo-title"`);
  html = removeElementByClass(html, "section", "st-gallery-closing")
    .replace("<span>08</span> PEOPLE &amp; APPOINTMENTS", "<span>08</span> PEOPLE, APPOINTMENTS &amp; CLIENT FEEDBACK")
    .replace("A personal process, from welcome to final adjustment.<span lang=\"vi\">Một hành trình riêng, từ lời chào đón đến lần tinh chỉnh cuối cùng.</span>", "A personal process, from welcome to final adjustment.<span lang=\"vi\">Hành trình riêng từ lời chào đón đến lần tinh chỉnh cuối cùng.</span>");
  const womenswear = findElementById(html, "section", "album-womenswear");
  if (!womenswear) throw new Error("Womenswear gallery album was not found for the fitting film.");
  const womenswearGrid = findElementByClass(html.slice(womenswear.start, womenswear.end), "div", "st-album-grid");
  if (!womenswearGrid) throw new Error("Womenswear gallery grid was not found for the fitting film.");
  const filmMarkup = `
<section class="st-gallery-film" aria-labelledby="st-gallery-film-title">
  <div class="st-gallery-film__copy">
    <p class="st-gallery-film__kicker">FITTING NOTES <span lang="vi">/ GHI CHÉP BUỔI THỬ ĐỒ</span></p>
    <h3 id="st-gallery-film-title">A fitting in motion<span lang="vi">Thử phom qua chuyển động</span></h3>
    <p id="st-gallery-film-description">${galleryFilm.description}<span lang="vi">Khách hàng xem lại đường nét và độ chuyển động của chân váy đen dài trong buổi thử đồ tại S.T Tailor, TP. Hồ Chí Minh.</span></p>
    <a class="st-gallery-film__link" href="/lien-he/">Arrange a fitting <span lang="vi">/ Đặt lịch thử đồ</span></a>
    <a class="st-gallery-film__link" href="${fittingFilmRoute}">Open the film page <span lang="vi">/ Mở trang xem phim</span></a>
  </div>
  <figure class="st-gallery-film__media">
    ${fittingFilmPlayer("st-gallery-film-description", { lazy: true })}
    <figcaption>Womenswear fitting at S.T Tailor<span lang="vi">Buổi thử trang phục nữ tại S.T Tailor</span></figcaption>
  </figure>
</section>`;
  const filmInsertAt = womenswear.start + womenswearGrid.end;
  html = `${html.slice(0, filmInsertAt)}${filmMarkup}${html.slice(filmInsertAt)}`;
  return replaceVisibleAtelier(applyGalleryAltText(html));
}

function transformPayment(html) {
  const range = findElementByClass(html, "section", "st-payment-methods");
  if (!range) throw new Error("The approved payment-method band is missing.");
  let methods = html.slice(range.start, range.end)
    .replace('<h2 id="st-methods-title">', '<h1 id="st-methods-title">')
    .replace('</h2>', '</h1>')
    .replace(/<p class="st-payment-methods__note">[\s\S]*?<\/p>/, '<p class="st-payment-methods__note">Choose a convenient method; we will share the payment details for your order.<span lang="vi">Chọn phương thức thuận tiện; chúng tôi sẽ cung cấp thông tin thanh toán cho đơn của bạn.</span></p>');
  const copy = [
    ['For cash payments, please use Vietnamese dong (VND) only. You can also pay by bank transfer or QR using the details we share for your order.', 'Nhà may chỉ nhận tiền mặt bằng đồng Việt Nam (VND). Bạn cũng có thể chuyển khoản hoặc quét mã QR theo thông tin thanh toán của đơn hàng.'],
    ['We accept international credit and debit cards, as well as prepaid cards, including Visa, Mastercard, American Express, JCB, UnionPay, Discover and Diners Club. We will guide you to the appropriate payment channel for your card.', 'Chúng tôi chấp nhận thẻ tín dụng và ghi nợ quốc tế, cũng như thẻ trả trước, bao gồm Visa, Mastercard, American Express, JCB, UnionPay, Discover và Diners Club. Chúng tôi sẽ hướng dẫn kênh thanh toán phù hợp với thẻ của bạn.'],
    ['Pay with Apple Pay, Google Pay or Samsung Pay using a compatible NFC device and supported card. Ask us for help with contactless payment at the showroom.', 'Thanh toán chạm bằng Apple Pay, Google Pay hoặc Samsung Pay với thiết bị NFC và thẻ tương thích. Chúng tôi hỗ trợ thanh toán không tiếp xúc tại showroom.']
  ];
  let card = 0;
  methods = methods.replace(/<article class="st-payment-card">[\s\S]*?<\/article>/g, (article) => {
    const index = card++;
    if (index >= copy.length) return "";
    if (index === 2) article = article.replace(/<h3>[\s\S]*?<\/h3>/, '<h3>NFC MOBILE PAYMENTS<br><span lang="vi">THANH TOÁN DI ĐỘNG NFC</span></h3>');
    const headEnd = article.indexOf("</h3>") + 5;
    if (headEnd < 5) throw new Error("Payment method heading is missing.");
    const [en, vi] = copy[index];
    return `${article.slice(0, headEnd)}<p>${en}<span lang="vi">${vi}</span></p></article>`;
  });
  if (card !== 4) throw new Error("The approved payment reference must contain four original method cards.");
  methods = methods.replaceAll("<h3>", "<h2>").replaceAll("</h3>", "</h2>");
  return `<div class="st-payment-page st-payment-page--focused">${methods}</div>`;
}

function transformAbout(html) {
  html = removeElementByClass(html, "section", "st-lux-gallery-redirect");
  html = removeElementByClass(html, "section", "st-lux-appointment");
  html = html
    .replace(/ aria-label="Open S\.T Tailor address in Google Maps[^\"]*"/, "")
    .replace('<div aria-label="Fabric selection"', '<div role="group" aria-label="Fabric selection"')
    .replace('<div aria-label="S.T Tailor work record"', '<div role="group" aria-label="S.T Tailor work record"')
    .replace(/\s*<p class="st-lux-provenance__archive-note[^"]*">[\s\S]*?<\/p>/, "")
    .replace(/<p class="st-lux-eyebrow">WHAT GUIDES THE WORK[\s\S]*?<\/p>/, "")
    .replace("S.T Tailor owner in the atelier", "S.T Tailor owner at the tailoring house")
    .replace(
      "From European cloth including Vitale Barberis Canonico to Vietnamese silk, the selection remains personal, practical and made for the occasion.<span lang=\"vi\">Từ vải Âu như Vitale Barberis Canonico đến lụa tơ tằm Việt Nam, mỗi lựa chọn đều dành riêng cho người mặc và dịp sử dụng.</span>",
      "From structured British cloth to expressive Italian selections—including Vitale Barberis Canonico—and Vietnamese silk, every material is considered against climate, movement and occasion.<span lang=\"vi\">Từ vải Anh giàu cấu trúc, vải Ý tinh tế, gồm các lựa chọn của Vitale Barberis Canonico, đến lụa tơ tằm Việt Nam, mỗi chất liệu đều được cân nhắc theo khí hậu, chuyển động và dịp sử dụng.</span>"
    );
  const provenanceRange = findElementByClass(html, "section", "st-lux-provenance");
  if (!provenanceRange) throw new Error("About provenance section was not found.");
  const clothHeritage = `
<section class="st-cloth-heritage" aria-labelledby="st-cloth-heritage-title">
  <div class="st-lux-shell">
    <header class="st-cloth-heritage__head st-motion st-motion-1">
      <p class="st-lux-eyebrow">THE CLOTH LIBRARY <span lang="vi">/ THƯ VIỆN CHẤT LIỆU</span></p>
      <h2 id="st-cloth-heritage-title">British character. Italian expression.<span lang="vi">Khí chất Anh. Dấu ấn Ý.</span></h2>
      <p>Cloth is chosen by hand for the line it creates, the climate it serves and the life the garment will lead.<span lang="vi">Chất liệu được chọn trực tiếp theo đường nét tạo nên, khí hậu sử dụng và nhịp sống của trang phục.</span></p>
    </header>
    <div class="st-cloth-heritage__gallery">
      <figure class="st-motion st-motion-1"><img src="/media/2026/09/fabric-focus-cloth-books.jpg" alt="Selection of tailoring cloth books at S.T Tailor" loading="lazy" decoding="async"><figcaption><b>British cloth</b><span lang="vi">Vải Anh tuyển chọn</span><small>Structure, resilience and a composed finish.<span lang="vi">Cấu trúc rõ nét, bền dáng và vẻ hoàn thiện điềm đạm.</span></small></figcaption></figure>
      <figure class="st-motion st-motion-2"><img src="/media/2026/09/st-tailor-gallery-canonico-cloth-books.jpg" alt="Vitale Barberis Canonico cloth books at S.T Tailor" loading="lazy" decoding="async"><figcaption><b>Italian cloth</b><span lang="vi">Vải Ý tinh tế</span><small>Supple handle, refined colour and an elegant drape, including Vitale Barberis Canonico selections.<span lang="vi">Mềm tay, màu sắc tinh tế và độ rũ thanh lịch, trong đó có các lựa chọn Vitale Barberis Canonico.</span></small></figcaption></figure>
      <figure class="st-motion st-motion-3"><img src="/media/2026/09/st-tailor-gallery-blush-silk-floral-dress.jpg" alt="Silk formalwear detail at S.T Tailor" loading="lazy" decoding="async"><figcaption><b>Vietnamese silk</b><span lang="vi">Lụa tơ tằm Việt Nam</span><small>Light, lustre and graceful movement for ceremonial and personal pieces.<span lang="vi">Ánh sắc, độ nhẹ và chuyển động mềm mại cho lễ phục cùng thiết kế riêng.</span></small></figcaption></figure>
    </div>
  </div>
</section>`;
  const consultationGuide = `
<section class="st-about-discovery" aria-labelledby="st-about-discovery-title">
  <div class="st-lux-shell st-about-discovery__shell">
    <header class="st-about-discovery__head st-motion st-motion-1">
      <p class="st-lux-eyebrow">PRIVATE TAILORING IN HO CHI MINH CITY <span lang="vi">/ MAY ĐO RIÊNG TẠI TP. HỒ CHÍ MINH</span></p>
      <h2 id="st-about-discovery-title">A clear place to begin.<span lang="vi">Một khởi đầu rõ ràng.</span></h2>
      <p>At our 258 Le Thanh Ton showroom, a consultation connects the occasion, cloth, fit and finishing before an order is confirmed.<span lang="vi">Tại showroom 258 Lê Thánh Tôn, buổi tư vấn kết nối dịp sử dụng, chất liệu, phom dáng và hoàn thiện trước khi xác nhận đơn may.</span></p>
    </header>
    <nav class="st-about-discovery__links" aria-label="S.T Tailor consultation paths | Lối vào tư vấn S.T Tailor">
      <a class="st-motion st-motion-1" href="/dich-vu/"><strong>BESPOKE TAILORING <span lang="vi">MAY ĐO RIÊNG</span></strong><small>Suits, shirts, formalwear and womenswear.<span lang="vi">Suit, sơ mi, lễ phục và trang phục nữ.</span></small><i aria-hidden="true">→</i></a>
      <a class="st-motion st-motion-2" href="/chinh-sua-trang-phuc/"><strong>CLOTHING ALTERATIONS <span lang="vi">CHỈNH SỬA TRANG PHỤC</span></strong><small>Practical refinements for garments you already own.<span lang="vi">Tinh chỉnh thực tế cho trang phục sẵn có.</span></small><i aria-hidden="true">→</i></a>
      <a class="st-motion st-motion-3" href="/lien-he/"><strong>PRIVATE CONSULTATION <span lang="vi">ĐẶT LỊCH TƯ VẤN</span></strong><small>Telephone, Messenger, Zalo, Instagram or WhatsApp.<span lang="vi">Điện thoại, Messenger, Zalo, Instagram hoặc WhatsApp.</span></small><i aria-hidden="true">→</i></a>
    </nav>
  </div>
</section>`;
  const galleryBridge = `
<section class="st-about-gallery-bridge" aria-labelledby="st-about-gallery-bridge-title">
  <div class="st-lux-shell">
    <a class="st-about-gallery-bridge__frame st-motion st-motion-2" href="/gallery/" aria-describedby="st-about-gallery-bridge-description">
      <figure><img src="/media/2026/09/st-tailor-floral-dinner-jacket-showroom.png" alt="Magenta and violet floral evening jacket in the S.T Tailor showroom | Áo khoác dự tiệc họa tiết hoa hồng tím tại showroom S.T Tailor" width="1086" height="1448" loading="lazy" decoding="async"></figure>
      <span class="st-about-gallery-bridge__copy">
        <span class="st-lux-eyebrow">THE S.T TAILOR GALLERY <span lang="vi">/ THƯ VIỆN HÌNH ẢNH S.T TAILOR</span></span>
        <strong id="st-about-gallery-bridge-title">See the work in full.<span lang="vi">Khám phá tác phẩm trọn vẹn.</span></strong>
        <small id="st-about-gallery-bridge-description">Cloth, fittings, finished garments and the showroom, gathered in one visual archive.<span lang="vi">Chất liệu, buổi thử đồ, trang phục hoàn thiện và showroom trong một thư viện hình ảnh.</span></small>
        <b>VIEW THE GALLERY <span lang="vi">XEM THƯ VIỆN HÌNH ẢNH</span><i aria-hidden="true">→</i></b>
      </span>
    </a>
  </div>
</section>`;
  html = `${html.slice(0, provenanceRange.end)}${clothHeritage}${consultationGuide}${galleryBridge}${html.slice(provenanceRange.end)}`;
  const tripadvisor = `
<section class="st-tripadvisor" id="st-tripadvisor" aria-labelledby="st-tripadvisor-title">
  <div class="st-lux-shell st-tripadvisor__inner">
    <header class="st-tripadvisor__copy">
      <div>
        <p class="st-lux-eyebrow">TRIPADVISOR</p>
        <h2 id="st-tripadvisor-title">Reviews from our clients<span lang="vi">Đánh giá của khách hàng</span></h2>
      </div>
      <p>Read how clients chose their cloth, what changed at their fittings and how the finished garments felt. After your visit, you can share your experience on Tripadvisor.<span lang="vi">Đọc chia sẻ của khách hàng về cách chọn vải, những điều chỉnh khi thử đồ và cảm nhận khi mặc trang phục hoàn thiện. Sau khi ghé nhà may, bạn cũng có thể chia sẻ trải nghiệm trên Tripadvisor.</span></p>
    </header>
    <div class="st-tripadvisor__card">
      <div class="st-tripadvisor__review">
        <h3>S.T Tailor on Tripadvisor<span lang="vi">S.T Tailor trên Tripadvisor</span></h3>
        <iframe class="st-tripadvisor__rating" src="${tripadvisorEmbedPath}" title="Tripadvisor badge for S.T Tailor / Huy hiệu Tripadvisor của S.T Tailor" loading="lazy" width="200" height="120" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe>
      </div>
      <div class="st-tripadvisor__actions">
        <a class="st-tripadvisor__link" href="https://www.tripadvisor.com/Attraction_Review-g293925-d34701232-Reviews-S_T_Tailor-Ho_Chi_Minh_City.html" target="_blank" rel="noopener noreferrer"><span>Read reviews</span><span lang="vi">Đọc đánh giá</span></a>
        <a class="st-tripadvisor__link st-tripadvisor__link--outline" href="https://www.tripadvisor.com/UserReviewEdit-g293925-d34701232-S_T_Tailor-Ho_Chi_Minh_City.html" target="_blank" rel="noopener noreferrer"><span>Write a review</span><span lang="vi">Viết đánh giá</span></a>
      </div>
    </div>
    <div class="st-tripadvisor__card">
      <div class="st-tripadvisor__visit">
        <h3>Visit S.T Tailor<span lang="vi">Ghé S.T Tailor</span></h3>
        <address>1st Floor, 258 Le Thanh Ton, Tan Dinh Ward<br>Ho Chi Minh City, Vietnam<span lang="vi">Lầu 1, 258 Lê Thánh Tôn, Phường Tân Định<br>Thành phố Hồ Chí Minh, Việt Nam</span></address>
        <p class="st-tripadvisor__hours">Open daily, 09:00–20:00<span lang="vi">Mở cửa mỗi ngày, 09:00–20:00</span></p>
      </div>
      <div class="st-tripadvisor__actions">
        <a class="st-tripadvisor__link st-tripadvisor__link--outline" href="/lien-he/#st-showroom-map"><span>Directions</span><span lang="vi">Đường đến nhà may</span></a>
        <a class="st-tripadvisor__link st-tripadvisor__link--outline" href="/quy-trinh-thu-do/"><span>Fitting process</span><span lang="vi">Quy trình thử đồ</span></a>
      </div>
    </div>
  </div>
</section>`;
  html = html.replace('<section class="st-lux-business st-motion st-motion-1">', `${showcaseHubLinks()}\n${tripadvisor}\n<section class="st-lux-business st-motion st-motion-1">`);
  return replaceVisibleAtelier(html);
}

function transformError(html) {
  return replaceVisibleAtelier(html)
    .replace(
      'This page has moved.<span lang="vi">Trang này đã được di chuyển.</span>',
      'Page not found.<span lang="vi">Không tìm thấy trang.</span>'
    )
    .replace(
      /<p>We could not find[\s\S]*?<\/p>/,
      '<p>The address may be mistyped or no longer available.<span lang="vi">Địa chỉ có thể bị gõ sai hoặc không còn được sử dụng.</span></p>'
    )
    .replace(
      /<div class="st-error-404__primary-actions">[\s\S]*?<\/div>/,
      '<div class="st-error-404__primary-actions"><a class="st-error-404__button st-error-404__button--dark" href="/">Back to Home <span lang="vi">Về trang chủ</span></a></div>'
    );
}

function transformPage(sourceFile, html, showcasePage) {
  const transforms = {
    "Home.html": transformHome,
    "Services.html": transformServices,
    "Pricing.html": transformPricing,
    "Contact.html": transformContact,
    "Gallery.html": transformGallery,
    "FittingFilm.html": (source) => source.replace("<!-- FITTING_FILM_PLAYER -->", fittingFilmPlayer("st-fitting-film-description")),
    "Payment.html": transformPayment,
    "Returns.html": () => clientCarePage("Returns.html"),
    "Shipping.html": () => clientCarePage("Shipping.html"),
    "Terms.html": () => clientCarePage("Terms.html"),
    "Privacy.html": () => clientCarePage("Privacy.html"),
    "About.html": transformAbout,
    "Error.html": transformError
  };
  return (showcasePage ? transformShowcase(showcasePage, html) : (transforms[sourceFile] ?? replaceVisibleAtelier)(html))
    .replace(/\bclass="([^"]*)"/g, (_, classes) => `class="${classes.split(/\s+/).filter((name) => name && !/^st-motion(?:-\d+)?$/.test(name)).join(" ")}"`)
    .replaceAll("Confirm the work, finish and timing in writing.", "Discuss the work, finish and timing with us.")
    .replaceAll("Xác nhận hạng mục, hoàn thiện và thời gian bằng văn bản.", "Trao đổi hạng mục, hoàn thiện và thời gian cùng chúng tôi.")
    .replaceAll("written quotation", "quotation")
    .replaceAll("báo giá bằng văn bản", "báo giá")
    .replaceAll("Báo giá bằng văn bản", "Báo giá");
}

function imageMetadata(html) {
  return [...html.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^\"]+)"[^>]*>/gi)].map((match) => ({
    src: match[1],
    alt: /\balt="([^\"]*)"/i.exec(match[0])?.[1] ?? ""
  }));
}

function enrichImageAttributes(html, { responsiveSizes, deprioritizeLazyImages = false } = {}) {
  const localImages = html.replace(/<img\b[^>]*\bsrc="(\/media\/[^\"]+)"[^>]*>/gi, (tag, src) => {
    const asset = decodeURIComponent(src.replace(/^\/media\//, ""));
    const metadata = imageManifest[asset];
    if (!metadata) return tag;
    let output = tag;
    if (!/\bwidth="\d+"/i.test(output)) output = output.replace(/<img\b/i, `<img width="${metadata.width}"`);
    if (!/\bheight="\d+"/i.test(output)) output = output.replace(/<img\b/i, `<img height="${metadata.height}"`);
    if (!/\bdecoding=/i.test(output)) output = output.replace(/<img\b/i, '<img decoding="async"');
    if (deprioritizeLazyImages && /\bloading="lazy"/i.test(output) && !/\bfetchpriority=/i.test(output)) {
      output = output.replace(/<img\b/i, '<img fetchpriority="low"');
    }
    if (responsiveSizes && metadata.responsive?.length && !/\bsrcset=/i.test(output)) {
      const isHomeHero = src === homeHeroImage && /\bst-home-v6__hero-media\b/.test(output);
      const isGalleryHero = /\bst-gallery-hero__story-image\b/.test(output);
      const isSuitFitHero = /\bst-suit-fit__hero-image\b/.test(output);
      const isLiningHero = /\bst-guide-lining-image\b/.test(output);
      const srcset = imageSourceSet(metadata.responsive);
      const sizes = isHomeHero ? homeHeroSizes : isGalleryHero ? galleryHeroSizes
        : isSuitFitHero ? suitFitHeroSizes
        : /\bst-showcase__hero-image\b/.test(output) ? showcaseHeroSizes
        : responsiveSizes;
      const lazyAuto = /\bloading="lazy"/i.test(output) ? "auto, " : "";
      output = output.replace(/<img\b/i, `<img srcset="${srcset}" sizes="${lazyAuto}${sizes}"`);
      if (metadata.responsive_avif?.length && (isGalleryHero || isSuitFitHero || isLiningHero || /\bst-showcase(?:__hero-image|-card__photo)\b/.test(output))) {
        return `<picture><source type="image/avif" srcset="${imageSourceSet(metadata.responsive_avif)}" sizes="${lazyAuto}${sizes}">${output}</picture>`;
      }
    }
    if (src === homeHeroImage && metadata.portrait && /\bst-home-v6__hero-media\b/.test(output)) {
      return `<picture><source type="image/avif" media="${homeHeroPortraitMedia}" srcset="${metadata.portrait_avif}"><source media="${homeHeroPortraitMedia}" srcset="${metadata.portrait}">${output}</picture>`;
    }
    if (/\bst-home-editorial__photo\b/.test(output) && metadata.responsive?.length) {
      // Cap the full-width secondary photos at about 2× on phone screens.
      const phoneSources = metadata.responsive.filter(({ width }) => width <= 768);
      if (phoneSources.length) {
        const media = `(max-width: 440px)`;
        const sizes = `auto, calc(100vw - 34px)`;
        const avif = metadata.mobile_avif?.length
          ? `<source type="image/avif" media="${media}" srcset="${imageSourceSet(metadata.mobile_avif)}" sizes="${sizes}">`
          : "";
        return `<picture>${avif}<source media="${media}" srcset="${imageSourceSet(phoneSources)}" sizes="${sizes}">${output}</picture>`;
      }
    }
    return output;
  });
  return localImages.replace(/<img\b[^>]*\bsrc="\/icons\/[^\"]+"[^>]*>/gi, (tag) => {
    let output = tag;
    if (/\balt=""/.test(output) && !/\baria-hidden=/.test(output)) output = output.replace(/<img\b/i, '<img aria-hidden="true"');
    if (!/\bwidth="\d+"/i.test(output)) output = output.replace(/<img\b/i, '<img width="24"');
    if (!/\bheight="\d+"/i.test(output)) output = output.replace(/<img\b/i, '<img height="24"');
    if (!/\bloading=/i.test(output)) output = output.replace(/<img\b/i, '<img loading="lazy"');
    if (!/\bdecoding=/i.test(output)) output = output.replace(/<img\b/i, '<img decoding="async"');
    return output;
  });
}

const buildDate = new Date().toISOString().slice(0, 10);
// Shared navigation gained substantial page links on this date. Advance this
// only for a meaningful shared-content change, never for CSS, JS or copyright.
const sharedContentModified = "2026-11-25";
// Advance the relevant date when transformed copy changes, not for build fixes.
const derivedContentModified = {
  "Home.html": "2026-11-22",
  "About.html": "2026-11-26",
  "Gallery.html": "2026-11-25", "Payment.html": "2026-11-22",
  "Returns.html": "2026-10-18", "Shipping.html": "2026-10-18",
  "Terms.html": "2026-10-18", "Privacy.html": "2026-10-18"
};

function lastModifiedFor(sourceFile) {
  // Derived copy and Gallery additions can change without touching the baseline.
  if (derivedContentModified[sourceFile]) {
    const inputs = [path.join("source", "wordpress", sourceFile)];
    if (sourceFile === "Gallery.html") inputs.push("source/media");
    if (["Returns.html", "Shipping.html", "Terms.html", "Privacy.html"].includes(sourceFile)) inputs.push("src/client-care-pages.js");
    const changed = spawnSync("git", ["status", "--porcelain", "--", ...inputs], { cwd: root, encoding: "utf8" });
    if (changed.status !== 0 || changed.stdout.trim()) return buildDate;
    const latest = spawnSync("git", ["log", "-1", "--format=%cs", "--", ...inputs], { cwd: root, encoding: "utf8" });
    const date = latest.stdout.trim();
    return [date, derivedContentModified[sourceFile], sharedContentModified].filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)).sort().at(-1);
  }
  const contentFile = path.join("source", "wordpress", sourceFile);
  const dirty = spawnSync("git", ["status", "--porcelain", "--", contentFile], { cwd: root, encoding: "utf8" });
  if (dirty.status !== 0 || dirty.stdout.trim()) return buildDate;
  const history = spawnSync("git", ["log", "-1", "--format=%cs", "--", contentFile], { cwd: root, encoding: "utf8" });
  const date = history.status === 0 ? history.stdout.trim() : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? (date > sharedContentModified ? date : sharedContentModified) : buildDate;
}

function header(activePath) {
  const nav = primaryNavigation.map(([href, label, vietnamese]) => `<a href="${href}"${activePath === href ? " aria-current=\"page\"" : ""}><span>${label}</span><span lang="vi">${vietnamese}</span></a>`).join("");
  return `<a class="st-skip-link" href="#main-content">Skip to content <span lang="vi">/ Chuyển đến nội dung</span></a>
<header class="st-site-header"><div class="st-site-header__bar">
  <a class="st-site-brand" href="/" aria-label="S.T Tailor home"><img src="/media/2026/09/logo-sttailor.png" alt="S.T Tailor" width="1239" height="1269" decoding="async"></a>
  <button class="st-nav-toggle" type="button" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false" aria-keyshortcuts="Alt+M" title="Menu · Alt+M" data-nav-toggle><i></i><i></i><i></i></button>
  <nav id="primary-navigation" class="st-site-nav" aria-label="Primary navigation" data-site-nav>${nav}</nav>
</div></header>`;
}

function footer(route) {
  const groups = [
    ["Showroom", "Nhà may", ["/", "/gioi-thieu/", "/gallery/", fittingFilmRoute, "/lien-he/"]],
    ["Tailoring services", "Dịch vụ may đo", ["/dich-vu/", ...serviceRoutes.map((page) => page.route), "/bang-gia/"]],
    ...showcaseHubs.map(({ route: hubRoute, labels }) => [...labels, [hubRoute, ...showcaseItemsFor(hubRoute).map(({ route }) => route)]]),
    ["Tailoring guide", "Cẩm nang may đo", ["/cam-nang-may-do/", ...guideRoutes.map(([href]) => href)]],
    ["Client Care", "Chăm sóc khách hàng", [clientCareHubRoute, ...policyRoutes]]
  ];
  const directory = groups.map(([english, vietnamese, paths]) => `
    <section aria-label="${english} | ${vietnamese}">
      <h3>${english}<span lang="vi">${vietnamese}</span></h3>
      <ul>${paths.map((href) => {
        const [title, translation] = pageLabels.get(href);
        return `<li><a href="${href}"${href === route ? ' aria-current="page"' : ''}><span>${title}</span><span lang="vi">${translation}</span><code>${href.replaceAll("/", "/<wbr>")}</code></a></li>`;
      }).join("")}</ul>
    </section>`).join("");
  return transformFooter(readSource("Footer.html"), route).replace("<!-- SITE_DIRECTORY -->", directory);
}

function documentFor(route, sourceFile, title, description, shareImage, shareImageAlt, lastModified) {
  const showcasePage = showcasePages.find(({ source }) => source === sourceFile);
  const showcaseHub = showcaseHubs.find(({ route: href }) => href === route);
  const responsiveSizes = {
    "/gallery/": "(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw",
    "/": homeEditorialSizes,
    // The square guide photo covers a 560px-tall frame on desktop.
    "/cam-nang-may-do/": "(max-width: 560px) calc(100vw - 28px), (max-width: 860px) calc(100vw - 48px), 560px",
    [liningGuide.route]: liningHeroSizes,
    "/san-pham/": showcaseCardSizes,
    "/du-an/": showcaseCardSizes
  }[route] ?? "(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 800px";
  const body = enrichImageAttributes(transformPage(sourceFile, readSource(sourceFile), showcasePage), {
    responsiveSizes,
    deprioritizeLazyImages: Boolean(showcaseHub) || sourceFile === "Home.html" || sourceFile === "Gallery.html"
  });
  const galleryImages = route === "/gallery/" ? imageMetadata(body) : [];
  const canonical = `https://sttailor.com${route}`;
  const business = {
    "@type": ["LocalBusiness", "ClothingStore"],
    "@id": "https://sttailor.com/#business",
    name: "S.T Tailor",
    alternateName: ["S.T Tailor HCMC", "S.T Tailor Ho Chi Minh City"],
    legalName: "SON THINH TMDV COMPANY LIMITED",
    taxID: "0319232823",
    founder: { "@type": "Person", name: "Trịnh Hoành Sơn", jobTitle: "Founder & Tailoring Consultant" },
    url: "https://sttailor.com/",
    logo: { "@type": "ImageObject", url: "https://sttailor.com/media/2026/09/logo-sttailor-1000x1024.png" },
    image: ["https://sttailor.com/media/2026/06/store-sttailor-1.webp", "https://sttailor.com/media/2026/06/store-sttailor-4.webp", "https://sttailor.com/media/2026/09/fabric-focus-cloth-books.jpg"],
    description: "Bespoke tailoring, formalwear and clothing alterations in Ho Chi Minh City.",
    telephone: "+84 909 556 258",
    email: "contact.sttailor@gmail.com",
    address: { "@type": "PostalAddress", streetAddress: "1st Floor, 258 Le Thanh Ton, Tan Dinh Ward", addressLocality: "Ho Chi Minh City", addressRegion: "Ho Chi Minh City", postalCode: "71008", addressCountry: "VN" },
    geo: { "@type": "GeoCoordinates", latitude: 10.7720874, longitude: 106.6957664 },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "09:00", closes: "20:00" }],
    areaServed: [{ "@type": "City", name: "Ho Chi Minh City" }, { "@type": "Country", name: "Vietnam" }],
    contactPoint: { "@type": "ContactPoint", telephone: "+84 909 556 258", email: "contact.sttailor@gmail.com", contactType: "customer service", areaServed: "VN", availableLanguage: ["Vietnamese", "English"] },
    priceRange: "$$$",
    currenciesAccepted: "VND",
    paymentAccepted: "Cash (VND only), Bank Transfer, QR, Credit Card, Debit Card, Prepaid Card, Visa, Mastercard, American Express, JCB, UnionPay, Discover, Diners Club, Apple Pay, Google Pay, Samsung Pay (NFC)",
    hasMap: "https://maps.app.goo.gl/j8N26uiQUC4J95vT6",
    knowsAbout: ["Bespoke tailoring", "Clothing alterations", "European suiting cloth", "Vietnamese silk", "Fittings and pattern cutting"],
    sameAs: ["https://facebook.com/sttailor.hcm/", "https://www.instagram.com/sttailorhcm/", "https://www.threads.com/@sttailorhcm", "https://wa.me/84909556258", "https://zalo.me/0909556258", "https://www.linkedin.com/company/sttailorhcm/", "https://youtube.com/@S.Ttailor", "https://www.tiktok.com/@sttailorhcm", "https://pinterest.com/sttailorhcm/", "https://www.tripadvisor.com/Attraction_Review-g293925-d34701232-Reviews-S_T_Tailor-Ho_Chi_Minh_City.html"]
  };
  business.hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: "S.T Tailor services",
    itemListElement: ["Bespoke suits and vests", "Blazers and separates", "Shirts and trousers", "Formalwear", "Womenswear", "Wedding and traditional clothing", "Clothing alterations", "Cloth consultation"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, provider: { "@id": "https://sttailor.com/#business" } } }))
  };
  const isCollection = showcaseHub || ["/gallery/", "/cam-nang-may-do/", clientCareHubRoute].includes(route);
  const pageType = route === "/gioi-thieu/" ? "AboutPage" : route === "/lien-he/" ? "ContactPage" : isCollection ? "CollectionPage" : "WebPage";
  const webPage = { "@type": pageType, "@id": `${canonical}#webpage`, url: canonical, name: title, description, isPartOf: { "@id": "https://sttailor.com/#website" }, about: { "@id": "https://sttailor.com/#business" }, primaryImageOfPage: { "@type": "ImageObject", url: `https://sttailor.com${shareImage}`, caption: shareImageAlt }, inLanguage: ["en", "vi"], dateModified: lastModified };
  const graph = [
    business,
    { "@type": "WebSite", "@id": "https://sttailor.com/#website", url: "https://sttailor.com/", name: "S.T Tailor", alternateName: ["S.T Tailor HCMC", "S.T Tailor Ho Chi Minh City"], inLanguage: ["en", "vi"], publisher: { "@id": "https://sttailor.com/#business" } },
    webPage,
    { "@type": "SiteNavigationElement", "@id": "https://sttailor.com/#navigation", name: primaryNavigation.map(([, label]) => label), url: primaryNavigation.map(([routePath]) => `https://sttailor.com${routePath}`) }
  ];
  if (["/", "/gioi-thieu/", "/lien-he/"].includes(route)) webPage.mainEntity = { "@id": "https://sttailor.com/#business" };
  if (route === "/dich-vu/") {
    graph.push({ "@type": "Service", "@id": `${canonical}#service`, name: "Bespoke tailoring and clothing alterations", alternateName: "May đo và sửa chữa trang phục", provider: { "@id": "https://sttailor.com/#business" }, areaServed: { "@type": "City", name: "Ho Chi Minh City" }, serviceType: ["Bespoke tailoring", "Formalwear", "Womenswear", "Clothing alterations"] });
    webPage.mainEntity = { "@id": `${canonical}#service` };
  }
  if (route === "/gallery/") {
    graph.push({
    "@type": "ItemList",
    "@id": `${canonical}#images`,
    name: "S.T Tailor Gallery | Thư viện hình ảnh S.T Tailor",
    description: "Bespoke tailoring, cloth, fittings, clients and showroom photographs. | Hình ảnh may đo, chất liệu, buổi thử đồ, khách hàng và showroom.",
    numberOfItems: galleryImages.length,
    itemListElement: galleryImages.map(({ src, alt }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "ImageObject", contentUrl: `https://sttailor.com${src}`, caption: alt, inLanguage: ["en", "vi"] }
    }))
    });
    webPage.mainEntity = { "@id": `${canonical}#images` };
  }
  if (route === fittingFilmRoute) {
    graph.push({
      "@type": "VideoObject",
      "@id": `${canonical}#womenswear-fitting-film`,
      name: galleryFilm.name,
      description: galleryFilm.description,
      thumbnailUrl: `https://sttailor.com${galleryFilm.poster}`,
      contentUrl: `https://sttailor.com${galleryFilm.src}`,
      uploadDate: galleryFilm.publishedAt,
      duration: `PT${galleryFilm.duration}S`,
      isPartOf: { "@id": `${canonical}#webpage` },
      publisher: { "@id": "https://sttailor.com/#business" }
    });
    webPage.mainEntity = { "@id": `${canonical}#womenswear-fitting-film` };
  }
  if (route === "/cam-nang-may-do/") {
    graph.push({ "@type": "ItemList", "@id": `${canonical}#guides`, name: "S.T Tailor tailoring guide | Cẩm nang may đo S.T Tailor", numberOfItems: guideRoutes.length, itemListElement: guideRoutes.map(([url, english, vietnamese], index) => ({ "@type": "ListItem", position: index + 1, name: `${english} | ${vietnamese}`, url: `https://sttailor.com${url}` })) });
    webPage.mainEntity = { "@id": `${canonical}#guides` };
  }
  if (guideRoutes.some(([guideRoute]) => guideRoute === route)) {
    graph.push({ "@type": "Article", "@id": `${canonical}#article`, headline: title.split(" | ")[0], description, image: `https://sttailor.com${shareImage}`, author: { "@id": "https://sttailor.com/#business" }, publisher: { "@id": "https://sttailor.com/#business" }, mainEntityOfPage: { "@id": `${canonical}#webpage` }, dateModified: lastModified, inLanguage: ["en", "vi"] });
    webPage.mainEntity = { "@id": `${canonical}#article` };
  }
  const service = serviceRoutes.find((page) => page.route === route);
  if (service) {
    const serviceId = `${canonical}#service`;
    graph.push({ "@type": "Service", "@id": serviceId, name: service.labels[0], alternateName: service.labels[1], description, url: canonical, image: `https://sttailor.com${shareImage}`, provider: { "@id": "https://sttailor.com/#business" }, areaServed: { "@type": "City", name: "Ho Chi Minh City" } });
    webPage.mainEntity = { "@id": serviceId };
  }
  if (showcaseHub) {
    const items = showcaseItemsFor(route);
    const listId = `${canonical}#work`;
    graph.push({
      "@type": "ItemList", "@id": listId, name: showcaseHub.labels.join(" | "), numberOfItems: items.length,
      itemListElement: items.map(({ route: href, labels }, index) => ({
        "@type": "ListItem", position: index + 1, name: labels.join(" | "), url: `https://sttailor.com${href}`
      }))
    });
    webPage.mainEntity = { "@id": listId };
  } else if (showcasePage) {
    const articleId = `${canonical}#article`;
    const about = route === "/du-an/nina-campos/"
      ? { "@type": "Person", name: "Niña Campos", jobTitle: "Singer" }
      : { "@type": "Thing", name: showcasePage.labels[0], alternateName: showcasePage.labels[1] };
    graph.push({
      "@type": "Article", "@id": articleId, headline: showcasePage.labels[0], description,
      image: `https://sttailor.com${shareImage}`, about, dateModified: lastModified, inLanguage: ["en", "vi"],
      author: { "@id": business["@id"] }, publisher: { "@id": business["@id"] }, mainEntityOfPage: { "@id": webPage["@id"] }
    });
    webPage.mainEntity = { "@id": articleId };
  }
  const trail = breadcrumbTrail(route);
  if (trail.length) {
    const itemListElement = trail.map(({ href, english }, index) => ({
      "@type": "ListItem", position: index + 1, name: english, item: `https://sttailor.com${href}`
    }));
    webPage.breadcrumb = { "@id": `${canonical}#breadcrumb` };
    graph.push({ "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement });
  }
  const jsonLd = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
  const safeTitle = title.replaceAll('"', "&quot;");
  const safeDescription = description.replaceAll('"', "&quot;");
  const safeImageAlt = shareImageAlt.replaceAll('"', "&quot;");
  const shareMetadata = imageManifest[shareImage.slice("/media/".length)];
  const sharePreview = shareMetadata.share;
  const shareImageUrl = `https://sttailor.com${sharePreview.src}`;
  const shareDimensions = `<meta property="og:image:width" content="${sharePreview.width}"><meta property="og:image:height" content="${sharePreview.height}">`;
  let heroPreload = "";
  if (sourceFile === "Home.html" && shareMetadata?.portrait) {
    const landscapeSizes = imageSourceSet(shareMetadata.responsive);
    heroPreload = `<link rel="preload" as="image" type="image/avif" media="${homeHeroPortraitMedia}" href="${shareMetadata.portrait_avif}" fetchpriority="high">` +
      `<link rel="preload" as="image" media="not all and ${homeHeroPortraitMedia}" imagesrcset="${landscapeSizes}" imagesizes="${homeHeroSizes}" fetchpriority="high">`;
  }
  if (sourceFile === "Gallery.html") {
    const candidates = imageManifest[galleryHeroImage.slice("/media/".length)].responsive_avif;
    if (candidates?.length) {
      heroPreload = `<link rel="preload" as="image" type="image/avif" imagesrcset="${imageSourceSet(candidates)}" imagesizes="${galleryHeroSizes}" fetchpriority="high">`;
    }
  }
  if (sourceFile === suitFitGuide.source || sourceFile === liningGuide.source || showcasePage) {
    const leadImage = showcaseHub ? showcaseItemsFor(route)[0]?.image : shareImage;
    const candidates = imageManifest[leadImage?.slice("/media/".length)]?.responsive_avif;
    if (candidates?.length) {
      const sizes = sourceFile === suitFitGuide.source ? suitFitHeroSizes : showcasePage?.summary ? showcaseHeroSizes : responsiveSizes;
      heroPreload = `<link rel="preload" as="image" type="image/avif" imagesrcset="${imageSourceSet(candidates)}" imagesizes="${sizes}" fetchpriority="high">`;
    }
  }
  const isWatchPage = route === fittingFilmRoute;
  if (isWatchPage) {
    heroPreload = `<link rel="preload" as="image" href="${galleryFilm.poster}" fetchpriority="high">`;
  }
  const fontPreload = `<link rel="preload" href="/fonts/${vietnameseFont}" as="font" type="font/woff2" crossorigin>`;
  const openGraphVideo = isWatchPage
    ? `<meta property="og:video" content="https://sttailor.com${galleryFilm.src}"><meta property="og:video:type" content="video/mp4">`
    : "";
  const siteHeader = enrichImageAttributes(header(route), { responsiveSizes: "102px" });
  const siteFooter = enrichImageAttributes(footer(sourceFile === "Error.html" ? null : route), { responsiveSizes: "160px" });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${heroPreload}<link rel="stylesheet" href="${stylesheetHref}">${fontPreload}${googleTagManagerHead}${analyticsTags}<meta name="description" content="${safeDescription}"><meta name="author" content="S.T Tailor"><meta name="application-name" content="S.T Tailor"><meta name="sttailor-build-revision" content="${buildRevision}"><meta name="color-scheme" content="light"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="google-site-verification" content="e1RyHPdDirO6wJIxuZKKSIY6EXYb37XMfktIVl3aJz8"><meta name="p:domain_verify" content="78c108c3384a3aa9201fb90b99f0b225"><link rel="canonical" href="${canonical}"><link rel="icon" href="/icons/sttailor-favicon-48.png" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="/icons/sttailor-apple-touch-180.png" sizes="180x180"><link rel="manifest" href="/site.webmanifest"><meta property="og:title" content="${safeTitle}"><meta property="og:description" content="${safeDescription}"><meta property="og:type" content="${isWatchPage ? "video.other" : "website"}">${openGraphVideo}<meta property="og:url" content="${canonical}"><meta property="og:site_name" content="S.T Tailor"><meta property="og:locale" content="en_US"><meta property="og:locale:alternate" content="vi_VN"><meta property="og:image" content="${shareImageUrl}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="${safeImageAlt}">${shareDimensions}<meta name="theme-color" content="#ead1ad"><title>${safeTitle}</title></head><body>${googleTagManagerNoScript}${metaPixelNoScript}<div class="st-site-frame">${siteHeader}<main id="main-content" tabindex="-1">${breadcrumbNavigation(trail)}${body}</main>${siteFooter}</div><script type="module" src="${scriptHref}"></script>${jsonLd}</body></html>`;
}

function collectAssetPaths() {
  const sourceFiles = [...routes.map(([, file]) => file), "Error.html", "Footer.html"];
  const content = [...sourceFiles.map((file) => readFileSync(path.join(sourceRoot, file), "utf8")), readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8")].join("\n");
  const matcher = /https?:\/\/sttailor\.com\/wp-content\/uploads\/([^\"' )]+)/g;
  const found = new Set(["2026/09/logo-sttailor.png", "2026/09/logo-sttailor-1000x1024.png"]);
  for (const match of content.matchAll(matcher)) found.add(match[1]);
  for (const [file] of franceClientPhotos) found.add(`2026/10/${file}`);
  return [...found].filter((asset) => !asset.includes(".."));
}

function copyAssets() {
  if (!existsSync(sourceMedia)) throw new Error(`Versioned media source not found: ${sourceMedia}`);
  const assets = collectAssetPaths();
  const missing = assets.filter((asset) => !existsSync(path.join(sourceMedia, asset)));
  if (missing.length) throw new Error(`Versioned media source is incomplete:\n${missing.join("\n")}`);
  for (const asset of assets) {
    const target = path.join(dist, "media", asset);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.join(sourceMedia, asset), target);
  }
  return assets;
}

function copyGalleryFilm() {
  for (const publicPath of [galleryFilm.src, galleryFilm.poster]) {
    const source = path.join(root, "source", "video", path.basename(publicPath));
    if (!existsSync(source)) throw new Error(`Gallery film asset is missing: ${source}`);
    const target = path.join(dist, publicPath.slice(1));
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(source, target);
  }
}

function copyIcons() {
  for (const iconPath of new Set(Object.values(iconPaths))) {
    if (!/^\/icons\/[a-z0-9-]+\.svg$/.test(iconPath)) throw new Error(`Invalid icon asset path: ${iconPath}`);
    const iconName = path.basename(iconPath);
    const original = path.join(sourceIcons, iconName);
    if (!existsSync(original)) throw new Error(`Missing local SVG icon: ${iconName}`);
    const target = path.join(dist, "icons", iconName);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(original, target);
  }
}

function buildImageManifest() {
  const shareImages = [...new Set(routes.map(([, , , , image]) => image.slice("/media/".length)))];
  const homeCards = [...transformHome(readSource("Home.html")).matchAll(/class="st-home-editorial__photo" src="\/media\/([^"]+)"/g)]
    .flatMap(([, asset]) => ["--home-card", asset]);
  const featureImages = [galleryHeroImage, suitFitGuide.image, liningGuide.image, ...showcaseEntries.map(({ image }) => image)]
    .flatMap((asset) => ["--feature-image", asset.slice("/media/".length)]);
  const result = spawnSync("python", [path.join(root, "scripts", "build-image-manifest.py"), sourceMedia, path.join(dist, "image-manifest.json"), ...shareImages, ...homeCards, ...featureImages], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Image manifest generation failed:\n${result.stderr || result.stdout}`);
  imageManifest = JSON.parse(readFileSync(path.join(dist, "image-manifest.json"), "utf8"));
  return Object.keys(imageManifest).length;
}

function assertGalleryHasNoDuplicates() {
  const gallery = transformGallery(readSource("Gallery.html"));
  const refs = [...gallery.matchAll(/<img\b[^>]*\bsrc="\/media\/([^\"]+)"[^>]*>/gi)]
    .map((match) => match[1])
    .filter((asset) => !/(?:logo-sttailor|LinkedInLogo)/i.test(asset));
  if (new Set(refs).size !== refs.length) throw new Error("Gallery source contains duplicate image references. Build stopped to preserve the no-duplicate gallery rule.");
}

// Windows can hold a transient handle on a freshly generated file. Node only
// retries EPERM/EBUSY cleanup when recursive removal is given retry settings.
// This keeps local validation reliable without changing deployed output.
rmSync(dist, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
mkdirSync(dist, { recursive: true });
assertGalleryHasNoDuplicates();
const assets = copyAssets();
copyGalleryFilm();
copyIcons();
mkdirSync(path.join(dist, "fonts"), { recursive: true });
for (const file of [vietnameseFont, "OFL-Noto-Sans.txt"]) {
  copyFileSync(path.join(sourceFonts, file), path.join(dist, "fonts", file));
}
const imageCount = buildImageManifest();
mkdirSync(path.join(dist, "styles"), { recursive: true });
mkdirSync(path.join(dist, "scripts"), { recursive: true });

const wordpressCss = readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8").replaceAll("https://sttailor.com/wp-content/uploads/", "/media/");
const standaloneCss = readFileSync(path.join(root, "src", "styles", "standalone-shell.css"), "utf8");
const fullCustomCss = `${wordpressCss}\n\n/* Cloudflare Worker standalone shell. WordPress page CSS above remains the visual source of truth. */\n${standaloneCss.trimEnd()}\n`;
// The editable export remains complete for owner maintenance. Only the served
// asset is minified, and its content hash keeps its immutable cache safe.
// These legacy page IDs are absent from every published route. Keep their
// reference CSS in CustomCSS-Full.css; prune selectors dedicated to them
// from the deployed bundle while retaining mixed selectors used elsewhere.
let productionCss = minifyCss({
  filename: "site.css",
  code: Buffer.from(fullCustomCss),
  minify: true,
  unusedSymbols: ["st-home-v4", "st-home-v5", "st-refund-v1", "st-privacy-v5"]
}).code.toString();
stylesheetHref = `/styles/site.css?v=${createHash("sha256").update(productionCss).digest("hex").slice(0, 12)}`;
writeFileSync(path.join(dist, "styles", "site.css"), productionCss, "utf8");
writeFileSync(path.join(root, "CustomCSS-Full.css"), fullCustomCss, "utf8");
const siteScript = readFileSync(path.join(root, "src", "scripts", "site.js"), "utf8");
scriptHref = `/scripts/site.js?v=${createHash("sha256").update(siteScript).digest("hex").slice(0, 12)}`;
writeFileSync(path.join(dist, "scripts", "site.js"), siteScript, "utf8");

const routeLastModified = new Map();
for (const [route, sourceFile, title, description, shareImage, shareImageAlt] of routes) {
  const output = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  const lastModified = lastModifiedFor(sourceFile);
  routeLastModified.set(route, lastModified);
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, documentFor(route, sourceFile, title, description, shareImage, shareImageAlt, lastModified), "utf8");
}
// Keep the full editable stylesheet, but omit project-specific selectors that
// cannot match any published page or class inserted by the site script. This
// deliberately ignores generic selectors and includes the 404 source so the
// cleanup cannot remove their styles by guessing from one viewport.
const publishedMarkup = routes.map(([route]) => readFileSync(route === "/"
  ? path.join(dist, "index.html")
  : path.join(dist, route.slice(1), "index.html"), "utf8")).join("\n");
const usedSymbols = `${publishedMarkup}\n${readSource("Error.html")}\n${siteScript}`;
// Flatsome's retired WordPress chrome is absent from the standalone site.
// Compare complete class/ID tokens: substring matching confuses `header`
// with the retained `st-site-header` and keeps thousands of unused rules.
// Keep the editable export intact; prune only these known theme selectors.
const publishedTokens = new Set([...`${publishedMarkup}\n${readSource("Error.html")}`.matchAll(/\b(?:class|id)="([^"]*)"/g)]
  .flatMap((match) => match[1].split(/\s+/)));
const retiredThemeSymbols = ["header", "header-wrapper", "header-main", "header-bg", "header-bg-color", "logo",
  "header-logo-dark", "header-logo-sticky", "nav", "header-nav", "icon-menu", "icon-search", "icon-shopping-bag",
  "current-menu-item", "nav-dropdown", "sub-menu", "footer-wrapper", "header-bottom", "stuck", "mobile-nav",
  "header-logo", "footer", "footer-1", "footer-2", "section", "section-content", "section-bg", "bg-fill",
  "absolute-footer", "header-button", "menu-item", "button", "menu-item-button", "header-nav-main", "header-inner",
  "nav-spacing-xlarge", "nav-icon", "main-menu", "nav-left", "nav-right", "hide-for-medium", "flex-left",
  "flex-right", "show-for-medium"].filter((symbol) => !publishedTokens.has(symbol) && !siteScript.includes(`"${symbol}"`) && !siteScript.includes(`'${symbol}'`));
const projectSymbols = [...new Set([...productionCss.matchAll(/[.#]((?:st-|stp-|stpr-)[A-Za-z0-9_-]+)/g)].map((match) => match[1]))];
const unusedProjectSymbols = projectSymbols.filter((symbol) => !usedSymbols.includes(symbol));
const leanCss = minifyCss({
  filename: "site.css",
  code: Buffer.from(fullCustomCss),
  minify: true,
  unusedSymbols: ["st-home-v4", "st-home-v5", "st-refund-v1", "st-privacy-v5", ...unusedProjectSymbols, ...retiredThemeSymbols]
}).code.toString();
if (leanCss.length < productionCss.length) {
  const previousStylesheetHref = stylesheetHref;
  productionCss = leanCss;
  stylesheetHref = `/styles/site.css?v=${createHash("sha256").update(productionCss).digest("hex").slice(0, 12)}`;
  writeFileSync(path.join(dist, "styles", "site.css"), productionCss, "utf8");
  for (const [route] of routes) {
    const pagePath = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
    const pageHtml = readFileSync(pagePath, "utf8");
    writeFileSync(pagePath, pageHtml.replace(previousStylesheetHref, stylesheetHref), "utf8");
  }
}
const notFoundDocument = documentFor("/", "Error.html", "Page not found | S.T Tailor", "The requested S.T Tailor page was not found.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom in Ho Chi Minh City", lastModifiedFor("Error.html"))
  .replace(/<meta name="robots" content="[^"]+">/, '<meta name="robots" content="noindex, follow">')
  .replace(/<meta name="googlebot" content="[^"]+">/, '<meta name="googlebot" content="noindex, follow">')
  .replace(/<link rel="canonical" href="[^"]+">/, "")
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
// Each page needs its own editorial rules plus the common shell, rather than
// every other page's project selectors. Keep generic/vendor rules and classes
// added by the site script. Identical bundles share a content-addressed URL;
// the complete site.css remains available for the 404 and source inspection.
const routeStyles = {};
const routeProjectSymbols = [...new Set([...productionCss.matchAll(/[.#]((?:st-|stp-|stpr-)[A-Za-z0-9_-]+)/g)].map((match) => match[1]))];
const usesGuideLayout = (file) => file.startsWith("Guide") || serviceRoutes.some(({ source }) => source === file);
const guideMarkup = routes.filter(([, file]) => usesGuideLayout(file))
  .map(([route]) => readFileSync(path.join(dist, route.slice(1), "index.html"), "utf8")).join("\n");
const legacyPageSymbols = ["st-home-v4", "st-home-v5", "st-refund-v1", "st-privacy-v5"];
const guideStyles = minifyCss({
  filename: "site.css",
  code: Buffer.from(fullCustomCss),
  minify: true,
  unusedSymbols: [...legacyPageSymbols, ...unusedProjectSymbols,
    ...routeProjectSymbols.filter((symbol) => !guideMarkup.includes(symbol) && !siteScript.includes(symbol)),
    ...retiredThemeSymbols]
}).code;
for (const [route, sourceFile] of routes) {
  const pagePath = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  const pageHtml = readFileSync(pagePath, "utf8");
  const pageSymbols = `${pageHtml}\n${siteScript}`;
  const pageCss = usesGuideLayout(sourceFile) ? guideStyles : minifyCss({
    filename: "site.css",
    // Start from the globally cleaned bundle. Re-reading the editable source
    // here restores legacy rules whose symbols were already removed above.
    code: Buffer.from(productionCss),
    minify: true,
    unusedSymbols: [...legacyPageSymbols, ...routeProjectSymbols.filter((symbol) => !pageSymbols.includes(symbol)), ...retiredThemeSymbols]
  }).code;
  const cssHash = createHash("sha256").update(pageCss).digest("hex").slice(0, 12);
  const href = `/styles/page-${cssHash}.css`;
  writeFileSync(path.join(dist, href.slice(1)), pageCss);
  writeFileSync(pagePath, pageHtml.replace(stylesheetHref, href), "utf8");
  routeStyles[route] = { href, bytes: pageCss.length };
}
writeFileSync(path.join(dist, "404.html"), notFoundDocument, "utf8");
writeFileSync(path.join(dist, "not-found.html"), notFoundDocument, "utf8");
const tripadvisorScript = readFileSync(path.join(root, "src", "scripts", "tripadvisor.js"), "utf8");
const tripadvisorScriptVersion = createHash("sha256").update(tripadvisorScript).digest("hex").slice(0, 12);
const tripadvisorEmbedDirectory = path.join(dist, tripadvisorEmbedPath.slice(1));
mkdirSync(tripadvisorEmbedDirectory, { recursive: true });
writeFileSync(path.join(dist, "scripts", "tripadvisor.js"), tripadvisorScript, "utf8");
writeFileSync(path.join(tripadvisorEmbedDirectory, "index.html"), readFileSync(path.join(root, "source", "tripadvisor-widget.html"), "utf8")
  .replace("/scripts/tripadvisor.js", `/scripts/tripadvisor.js?v=${tripadvisorScriptVersion}`), "utf8");
writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://sttailor.com/sitemap.xml\n", "utf8");
writeFileSync(path.join(dist, indexNowKeyFile), `${indexNowKey}\n`, "utf8");
const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const publishedImageLocations = new Set();
const sitemapRouteOrder = [routes.find(([route]) => route === "/gallery/"), ...routes.filter(([route]) => route !== "/gallery/")];
const sitemapEntries = sitemapRouteOrder.map(([route, , , , shareImage]) => {
  const pagePath = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  const pageHtml = readFileSync(pagePath, "utf8");
  const imageLocations = new Set([shareImage]);
  for (const match of pageHtml.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^"]+)"[^>]*>/gi)) {
    if (route === "/gallery/" && /(?:logo-sttailor|LinkedInLogo)/i.test(match[1])) continue;
    imageLocations.add(match[1]);
  }
  const pageImages = [...imageLocations].filter((src) => {
    if (publishedImageLocations.has(src)) return false;
    publishedImageLocations.add(src);
    return true;
  });
  const imageEntries = pageImages.slice(0, 1000).map((src) => `<image:image><image:loc>https://sttailor.com${xmlEscape(src)}</image:loc></image:image>`).join("");
  const videoEntry = route === fittingFilmRoute
    ? `<video:video><video:thumbnail_loc>https://sttailor.com${galleryFilm.poster}</video:thumbnail_loc><video:title>${xmlEscape(galleryFilm.name)}</video:title><video:description>${xmlEscape(galleryFilm.description)}</video:description><video:content_loc>https://sttailor.com${galleryFilm.src}</video:content_loc><video:duration>${galleryFilm.duration}</video:duration><video:publication_date>${galleryFilm.publishedAt}</video:publication_date></video:video>`
    : "";
  return `\n  <url><loc>https://sttailor.com${route}</loc><lastmod>${routeLastModified.get(route) ?? buildDate}</lastmod>${imageEntries}${videoEntry}</url>`;
}).join("");
writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${sitemapEntries}\n</urlset>\n`, "utf8");
writeFileSync(path.join(dist, "site.webmanifest"), JSON.stringify({ name: "S.T Tailor", short_name: "S.T Tailor", description: "Bespoke tailoring and clothing alterations in Ho Chi Minh City.", start_url: "/", scope: "/", display: "standalone", background_color: "#f3e1c5", theme_color: "#ead1ad", icons: [{ src: "/icons/sttailor-app-192.png", sizes: "192x192", type: "image/png", purpose: "any" }, { src: "/icons/sttailor-app-large-512.png", sizes: "512x512", type: "image/png", purpose: "any" }] }, null, 2), "utf8");
mkdirSync(path.join(dist, ".well-known"), { recursive: true });
copyFileSync(path.join(root, "source", "security.txt"), path.join(dist, ".well-known", "security.txt"));
const showcaseSummaries = new Map(showcaseEntries.map(({ route, summary }) => [route, summary]));
const llmsLink = ([route, , , description]) => `- [${pageLabels.get(route).join(" / ")}](https://sttailor.com${route}): ${showcaseSummaries.get(route)?.join(" / ") ?? description}`;
const guidePaths = new Set(["/cam-nang-may-do/", ...guideRoutes.map(([route]) => route)]);
const showcasePaths = new Set(showcasePages.map(({ route }) => route));
const clientCarePaths = new Set([clientCareHubRoute, ...policyRoutes]);
const llmsSections = [
  ["Showroom and services / Nhà may và dịch vụ", routes.filter(([route]) => !clientCarePaths.has(route) && !guidePaths.has(route) && !showcasePaths.has(route))],
  ...showcaseHubs.map(({ route: hubRoute, labels }) => [labels.join(" / "), routes.filter(([route]) => route.startsWith(hubRoute))]),
  ["Tailoring guide / Cẩm nang may đo", routes.filter(([route]) => guidePaths.has(route))],
  ["Client Care / Chăm sóc khách hàng", routes.filter(([route]) => clientCarePaths.has(route))]
].map(([heading, entries]) => `## ${heading}\n\n${entries.map(llmsLink).join("\n")}`).join("\n\n");
writeFileSync(path.join(dist, "llms.txt"), `# S.T Tailor

> Bespoke tailoring, clothing alterations and private fittings in Ho Chi Minh City. May đo, chỉnh sửa trang phục và tư vấn riêng tại Thành phố Hồ Chí Minh.

Showroom: 1st Floor, 258 Le Thanh Ton, Tan Dinh Ward, Ho Chi Minh City, Vietnam. Open daily, 09:00–20:00 (Asia/Ho_Chi_Minh). Walk-ins are welcome and appointments are available.

Địa chỉ: Lầu 1, 258 Lê Thánh Tôn, Phường Tân Định, Thành phố Hồ Chí Minh, Việt Nam. Mở cửa mỗi ngày từ 09:00 đến 20:00. Khách có thể ghé trực tiếp hoặc đặt lịch hẹn.

Services include bespoke and made-to-measure suits, shirts, formalwear, womenswear and clothing alterations. The cloth selection includes European fabrics, such as Vitale Barberis Canonico, alongside Vietnamese silk. The pages below contain both English and Vietnamese.

S.T Tailor nhận may đo suit, sơ mi, lễ phục, trang phục nữ và chỉnh sửa trang phục. Nhà may giới thiệu vải châu Âu, trong đó có Vitale Barberis Canonico, cùng lụa tơ tằm Việt Nam. Các trang bên dưới có nội dung tiếng Anh và tiếng Việt.

${llmsSections}

## Direct contact / Liên hệ trực tiếp

- [Telephone / Điện thoại](tel:+84909556258): +84 909 556 258
- [Email](mailto:contact.sttailor@gmail.com): contact.sttailor@gmail.com
- [Messenger](https://m.me/sttailor.hcm)
- [Zalo](https://zalo.me/0909556258)
- [Instagram](https://www.instagram.com/sttailorhcm/)
- [WhatsApp](https://wa.me/84909556258)
`.normalize("NFC"), "utf8");
const assetHeaders = "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n  Strict-Transport-Security: max-age=15552000\n  Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests\n";
// The asset binding carries these headers into the Worker response, allowing
// Cloudflare Early Hints to discover the critical CSS for each public page.
const stylesheetHints = Object.entries(routeStyles).map(([route, { href }]) => `${route}\n  Link: <${href}>; rel=preload; as=style`);
writeFileSync(path.join(dist, "_headers"), [assetHeaders.trimEnd(), ...stylesheetHints].join("\n\n") + "\n", "utf8");
writeFileSync(path.join(dist, "build-manifest.json"), JSON.stringify({ source: "source/wordpress", sourceMedia: "source/media", revision: buildRevision, routes: routes.map(([route]) => route), routeStyles, localUploadAssets: assets.length, imageMetadata: imageCount, galleryDuplicateCheck: "passed" }, null, 2), "utf8");
console.log(`Built ${routes.length} routes from the versioned WordPress reference with ${assets.length} local upload assets and dimensions for ${imageCount} images.`);
