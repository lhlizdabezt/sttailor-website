import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { transform as minifyCss } from "lightningcss";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexNowKey, indexNowKeyFile } from "../src/indexnow.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// This directory is intentionally read-only. It is the approved WordPress
// reference supplied by the owner; the Worker output is derived from it.
const sourceRoot = path.join(root, "source", "wordpress");
const sourceMedia = path.join(root, "source", "media");
const sourceIcons = path.join(root, "source", "icons");
const iconPaths = JSON.parse(readFileSync(path.join(sourceIcons, "manifest.json"), "utf8"));
const dist = path.join(root, "dist");
let stylesheetHref = "/styles/site.css";
const buildRevision = /^[0-9a-f]{40}$/i.test(process.env.STTAILOR_BUILD_REVISION || "")
  ? process.env.STTAILOR_BUILD_REVISION
  : "local";
let scriptHref = "/scripts/site.js";
let imageManifest = {};
// Production measurement IDs are public browser identifiers, not credentials.
// Keep the vendors here so every generated route receives exactly one copy.
// Keep both measurement queues available immediately, but wait until the first
// page paint before downloading vendor code. This preserves page_view and
// interaction events while keeping vendor-code parsing off the LCP critical path.
const analyticsTags = `<link rel="preconnect" href="https://www.clarity.ms"><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-BQDKE20XR0");(function(c,l,a){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}})(window,document,"clarity");(()=>{const load=()=>{if(window.__stAnalyticsLoaded)return;window.__stAnalyticsLoaded=true;const g=document.createElement("script");g.async=true;g.src="/n31x/";document.head.appendChild(g);const clarityProjectId="ymcn0kdqo0";const c=document.createElement("script");c.async=true;c.src="https://www.clarity.ms/tag/"+clarityProjectId;document.head.appendChild(c)};const idle=window.requestIdleCallback||((cb)=>setTimeout(cb,1200));if(document.readyState==="complete")idle(load);else window.addEventListener("load",()=>idle(load),{once:true})})();</script>`;

const routes = [
  ["/", "Home.html", "S.T Tailor | Bespoke Tailoring in Ho Chi Minh City", "Bespoke suits, shirts, formalwear and alterations at 258 Lê Thánh Tôn, Ho Chi Minh City. Private consultations available.", "/media/2026/06/background-hero-trang-lien-he-sttailor.webp", "Private fitting at S.T Tailor in Ho Chi Minh City"],
  ["/gioi-thieu/", "About.html", "About S.T Tailor | Bespoke Tailoring & Alterations in HCMC", "Meet S.T Tailor in Ho Chi Minh City for bespoke suits, formalwear, clothing alterations, British and Italian cloth, Vietnamese silk and private fittings.", "/media/2026/09/fabric-focus-cloth-books.jpg", "Tailoring cloth books selected at S.T Tailor"],
  ["/dich-vu/", "Services.html", "Bespoke Tailoring & Alterations in HCMC | S.T Tailor", "Explore bespoke suits, shirts, formalwear, womenswear, fittings and clothing alterations by S.T Tailor in central Ho Chi Minh City.", "/media/2026/09/st-tailor-client-fabric-consultation.jpg", "Client reviewing tailoring fabrics with S.T Tailor | Khách hàng chọn vải may đo cùng S.T Tailor"],
  ["/gallery/", "Gallery.html", "Bespoke Tailoring Gallery in HCMC | S.T Tailor", "View S.T Tailor's cloth, fittings, suits, formalwear, womenswear, garment details and showroom in Ho Chi Minh City.", "/media/2026/09/st-tailor-gallery-showroom-tailoring-display.jpg", "S.T Tailor showroom and tailoring display"],
  ["/bang-gia/", "Pricing.html", "Bespoke Tailoring Prices in HCMC | S.T Tailor", "Review starting prices for bespoke suits, shirts, formalwear and clothing alterations before consulting S.T Tailor in Ho Chi Minh City.", "/media/2026/09/st-tailor-navy-double-breasted-front.jpeg", "Navy double-breasted suit by S.T Tailor"],
  ["/phuong-thuc-thanh-toan/", "Payment.html", "Payment Methods & Terms | S.T Tailor HCMC", "Review payment terms for S.T Tailor bespoke and alteration orders, including cards, bank transfer, digital wallets, deposits, invoices and refunds.", "/media/2026/06/store-sttailor-2.webp", "S.T Tailor showroom in Ho Chi Minh City"],
  ["/lien-he/", "Contact.html", "Contact S.T Tailor HCMC | Private Consultation", "Contact S.T Tailor by telephone, email, Messenger, Zalo, Instagram or WhatsApp and arrange a private tailoring consultation.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom at 258 Lê Thánh Tôn"],
  ["/cam-nang-may-do/", "GuideHub.html", "Tailoring Guide in HCMC | S.T Tailor", "Read practical bilingual guidance from S.T Tailor on choosing cloth, fittings, alterations and caring for tailored garments in Ho Chi Minh City.", "/media/2026/09/fabric-focus-swatch-books.jpg", "Tailoring cloth swatches at S.T Tailor"],
  ["/chon-vai-may-do/", "GuideCloth.html", "How to Choose Suit Fabric in HCMC | S.T Tailor", "Choose suit and formalwear cloth by occasion, climate, drape and care with practical bilingual guidance from S.T Tailor in Ho Chi Minh City.", "/media/2026/09/st-tailor-gallery-canonico-cloth-books.jpg", "Vitale Barberis Canonico cloth books at S.T Tailor"],
  ["/quy-trinh-thu-do/", "GuideFitting.html", "Bespoke Fitting Process in HCMC | S.T Tailor", "Understand consultation, measurement, fittings, refinement and handover for a bespoke garment at S.T Tailor in central Ho Chi Minh City.", "/media/2026/09/st-tailor-client-measurement-session.jpg", "Tailor measuring a client during a fitting at S.T Tailor"],
  ["/chinh-sua-trang-phuc/", "GuideAlterations.html", "Clothing Alterations in HCMC | S.T Tailor Guide", "Learn what S.T Tailor assesses before altering trouser hems, waists, jacket sleeves and garment repairs in central Ho Chi Minh City.", "/media/2026/09/st-tailor-gallery-trouser-interior-detail.jpg", "Tailored trouser interior and seam finishing at S.T Tailor"],
  ["/bao-quan-giat-la/", "GuideCare.html", "Suit Care & Garment Cleaning Guide | S.T Tailor", "Follow a practical bilingual guide to airing, brushing, storing, spot care, washing, ironing and professional cleaning for tailored garments.", "/media/2026/09/st-tailor-gallery-jacket-lining-mannequin.jpg", "Tailored jacket lining and construction at S.T Tailor"],
  ["/doi-tra-hoan-tien/", "Returns.html", "Returns & Refunds for Tailored Garments | S.T Tailor", "Read S.T Tailor's bilingual returns and refunds policy for made-to-measure garments, alterations, order concerns, cancellations and documented refunds.", "/media/2026/09/fabric-focus-cloth-books.jpg", "Tailoring cloth books used when confirming a S.T Tailor order"],
  ["/chinh-sach-van-chuyen/", "Shipping.html", "Shipping & Delivery for Tailored Garments | S.T Tailor", "Explore S.T Tailor's bilingual delivery options for showroom collection, Ho Chi Minh City couriers, Vietnam shipping and international dispatch.", "/media/2026/06/store-sttailor-2.webp", "S.T Tailor showroom for garment collection and handover"],
  ["/dieu-khoan-dieu-kien/", "Terms.html", "Terms & Conditions for Tailoring Orders | S.T Tailor", "Review S.T Tailor's bilingual order terms covering quotations, bespoke fittings, payments, delivery, changes and consumer rights in Vietnam.", "/media/2026/09/fabric-focus-cloth-books.jpg", "S.T Tailor fabric library for bespoke orders"],
  ["/chinh-sach-bao-mat/", "Privacy.html", "Privacy Policy & Client Data | S.T Tailor", "Learn how S.T Tailor handles enquiries, measurements, order details and website analytics, with bilingual privacy information and contact options.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom in Ho Chi Minh City"]
];

const primaryNavigation = [
  ["/gioi-thieu/", "About"],
  ["/dich-vu/", "Services"],
  ["/gallery/", "Gallery"],
  ["/bang-gia/", "Pricing"],
  ["/phuong-thuc-thanh-toan/", "Payment methods"],
  ["/doi-tra-hoan-tien/", "Client care"],
  ["/lien-he/", "Contact"]
];

const guideRoutes = [
  ["/chon-vai-may-do/", "Choosing cloth", "Chọn vải may đo"],
  ["/quy-trinh-thu-do/", "The fitting process", "Quy trình thử đồ"],
  ["/chinh-sua-trang-phuc/", "Clothing alterations", "Chỉnh sửa trang phục"],
  ["/bao-quan-giat-la/", "Garment care and cleaning", "Bảo quản và giặt là"]
];

function readSource(file) {
  return readFileSync(path.join(sourceRoot, file), "utf8")
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
    .replace(
      /<a class="st-home-v6__hero-jump"[^>]*>[\s\S]*?<\/a>/,
      '<a class="st-home-v6__hero-jump" href="/lien-he/"><span>ARRANGE A PRIVATE CONSULTATION</span><span lang="vi">ĐẶT LỊCH TƯ VẤN RIÊNG</span></a>'
    );
  html = removeElementByClass(html, "nav", "st-home-v6__routes");
  html = removeElementByClass(html, "section", "st-home-v6__gallery");
  const editorial = `
  <section class="st-home-editorial" aria-label="S.T Tailor visual destinations | Lối vào hình ảnh S.T Tailor">
    <a class="st-home-editorial__frame st-motion st-motion-1" href="/gioi-thieu/">
      <img src="/media/2026/09/fabric-focus-cloth-books.jpg" alt="Tailoring cloth books selected at S.T Tailor" width="2048" height="2048" loading="lazy" decoding="async">
      <span>CLOTH <small lang="vi">CHẤT LIỆU</small></span>
    </a>
    <a class="st-home-editorial__frame st-home-editorial__frame--tall st-motion st-motion-2" href="/dich-vu/">
      <img src="/media/2026/09/st-tailor-client-fitted-suit.jpg" alt="Fitted suit at S.T Tailor" width="1536" height="1920" loading="lazy" decoding="async">
      <span>FIT <small lang="vi">PHOM DÁNG</small></span>
    </a>
    <a class="st-home-editorial__frame st-motion st-motion-3" href="/gallery/">
      <img src="/media/2026/06/store-sttailor-4.webp" alt="S.T Tailor showroom interior" width="1086" height="1448" loading="lazy" decoding="async">
      <span>HOUSE <small lang="vi">NHÀ MAY</small></span>
    </a>
    <a class="st-home-editorial__frame st-motion st-motion-4" href="/bang-gia/">
      <img src="/media/2026/09/st-tailor-navy-double-breasted-front.jpeg" alt="Navy double-breasted suit by S.T Tailor" width="1536" height="2048" loading="lazy" decoding="async">
      <span>PRICING <small lang="vi">BẢNG GIÁ</small></span>
    </a>
    <a class="st-home-editorial__frame st-motion st-motion-5" href="/lien-he/">
      <img src="/media/2026/09/st-tailor-client-private-consultation.jpg" alt="Private tailoring consultation at S.T Tailor" width="1536" height="2048" loading="lazy" decoding="async">
      <span>CONSULT <small lang="vi">ĐẶT LỊCH</small></span>
    </a>
  </section>`;
  const guideStrip = `
  <a class="st-home-guide-strip" href="/cam-nang-may-do/">
    <strong>Cloth · fitting · alterations <small lang="vi">Chất liệu · thử đồ · chỉnh sửa</small></strong>
    <span>OPEN THE GUIDE <small lang="vi">XEM CẨM NANG</small><i aria-hidden="true">→</i></span>
  </a>`;
  return html.replace(/\s*<\/section>\s*$/, `${editorial}${guideStrip}\n</section>`);
}

function transformFooter(html) {
  html = removeElementByClass(html, "div", "st-footer-v7__top")
    .replace('loading="eager"', 'loading="lazy"')
    .replaceAll('alt="" aria-hidden="true">', 'alt="" aria-hidden="true" width="20" height="20">')
    .replace(/\s*<a href="tel:[^"]+">[\s\S]*?<\/a>/, "")
    .replace(/\s*<a href="mailto:[^"]+">[\s\S]*?<\/a>/, "")
    .replace("Atelier gallery", "S.T Tailor gallery")
    .replace(
      '<section class="st-footer-v7__about" aria-labelledby="st-footer-title">',
      '<section class="st-footer-v7__about" aria-labelledby="st-footer-title">\n        <a class="st-footer-v7__crest" href="/" aria-label="S.T Tailor home"><img src="/media/2026/09/logo-sttailor-1000x1024.png" alt="S.T Tailor" width="1000" height="1024" loading="lazy" decoding="async"></a>'
    );
  return replaceVisibleAtelier(html);
}

function transformServices(html) {
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
        <h1 id="st-bespoke-process-title">From conversation to a garment that belongs to you.<span lang="vi">Từ cuộc trò chuyện đến trang phục thực sự thuộc về bạn.</span></h1>
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
  html = html.replace('  <aside class="st-service-booking"', `${bespokeProcess}\n\n  <aside class="st-service-booking"`);
  return replaceVisibleAtelier(html);
}

function transformPricing(html) {
  html = removeElementByClass(html, "header", "stpr-hero")
    .replace('<h2 id="stpr-priceboard-title">', '<h1 id="stpr-priceboard-title">')
    .replace('</span></h2>\n          </div>\n          <p>Each starting price is a guide', '</span></h1>\n          </div>\n          <p>Each starting price is a guide')
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
    .replace(/\s*<p>Tell us what you are dressing for\.[\s\S]*?<\/p>/, "")
    .replace(/\s*<section class="st-contact-gallery-redirect"[\s\S]*?<\/section>/, "")
    .replace(/\s*<p class="st-contact-summary">[\s\S]*?<\/p>/, "")
    .replace(/\s*<div class="st-contact-line small"><\/div>/, "")
    .replace(
      '<h2>CONTACT DETAILS<br><span lang="vi">THÔNG TIN LIÊN HỆ</span></h2>',
      '<h1>CONTACT DETAILS<br><span lang="vi">THÔNG TIN LIÊN HỆ</span></h1>'
    );
  for (const className of ["st-contact-card--linkedin", "st-contact-card--pinterest", "st-contact-card--youtube", "st-contact-card--tiktok"]) {
    html = removeElementByClass(html, "article", className);
  }
  html = html.replace(
    /<article class="st-contact-card st-contact-card--facebook">[\s\S]*?<\/article>/,
    '<article class="st-contact-card st-contact-card--messenger"><span class="st-contact-card__icon"><img src="/icons/simple-messenger-0084ff.svg" alt="" aria-hidden="true"></span><h3>MESSENGER <span lang="vi">NHẮN TIN MESSENGER</span></h3><p>S.T Tailor HCM<span lang="vi">Trao đổi trực tiếp với S.T Tailor</span></p><a href="https://m.me/sttailor.hcm" target="_blank" rel="noopener noreferrer">MESSAGE S.T TAILOR&nbsp;/&nbsp;<span lang="vi">NHẮN TIN NGAY</span></a></article>'
  );
  return replaceVisibleAtelier(html);
}

const galleryAltText = {
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
  "st-tailor-floral-dinner-jacket-showroom.png": "Magenta and violet floral dinner jacket in the S.T Tailor showroom | Áo khoác dự tiệc floral tông hồng tím tại showroom S.T Tailor",
  "st-tailor-floral-dinner-jacket-lapel.png": "Floral dinner jacket lapel and cloth detail | Chi tiết ve áo và chất liệu của áo khoác dự tiệc floral",
  "st-tailor-floral-dinner-jacket-front.png": "Floral dinner jacket front and pocket detail | Chi tiết thân trước và túi của áo khoác dự tiệc floral",
  "st-tailor-floral-dinner-jacket-texture.jpg": "Magenta and violet floral dinner jacket jacquard texture and pocket seam | Chất liệu jacquard và đường may túi của áo khoác dự tiệc floral tông hồng tím",
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
  "st-tailor-gallery-showroom-tailoring-display.jpg": "Tailoring display with suit and dress forms at S.T Tailor | Khu trưng bày may đo với suit và mannequin tại S.T Tailor",
  "st-tailor-garment-rack.jpeg": "Garments on a showroom rail | Trang phục trên giá treo tại showroom",
  "st-tailor-gallery-duk-0058.jpg": "S.T Tailor showroom interior with garments on display | Không gian S.T Tailor với trang phục trưng bày",
  "st-tailor-gallery-duk-0038.jpg": "Tailoring accessories displayed on a shelf | Phụ kiện may đo trưng bày trên kệ",
  "st-tailor-gallery-duk-0064.jpg": "S.T Tailor showroom interior with garment rail | Không gian S.T Tailor với giá treo trang phục",
  "st-tailor-archive-founder-one.jpeg": "Brown tailored trouser cuff with leather shoes | Gấu quần nâu may đo cùng giày da",
  "st-tailor-archive-founder-two.jpeg": "Tailored jacket, tie and lapel pin detail | Chi tiết áo khoác may đo, cà vạt và ghim ve áo",
  "st-tailor-archive-founder-three.jpeg": "Brown tailored suit shoulder and lapel detail | Chi tiết vai và ve áo suit nâu may đo",
  "st-tailor-archive-founder-four.jpeg": "Man wearing a brown tailored suit in the showroom | Người mặc suit nâu may đo tại showroom",
  "st-tailor-archive-founder-five.jpeg": "Watch and measuring tape during a tailoring appointment | Đồng hồ và thước dây trong buổi hẹn may đo",
  "st-tailor-archive-founder-six.jpeg": "Portrait of a client in a brown tailored suit | Chân dung khách hàng trong suit nâu may đo",
  "st-tailor-archive-founder-seven.jpeg": "Client selecting a jacket in the showroom | Khách hàng chọn áo khoác tại showroom",
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

function transformGallery(html) {
  html = html.replace(
    /\s*<p>Eleven albums gather tailoring[\s\S]*?<\/p>/,
    ""
  );
  const archiveRange = findElementById(html, "section", "album-archive");
  const feedbackRange = findElementById(html, "section", "album-client-feedback");
  if (!archiveRange || !feedbackRange) throw new Error("Expected WordPress gallery albums are missing.");
  const archive = html.slice(archiveRange.start, archiveRange.end);
  const feedback = html.slice(feedbackRange.start, feedbackRange.end);
  const archiveDetail = figureForAsset(archive, "st-tailor-archive-atelier-four.jpg");
  const archiveFabric = figureForAsset(archive, "st-tailor-gallery-partner-certificate.jpg");
  const feedbackFigures = [...feedback.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi)].map((match) => match[0]);
  html = appendToGalleryAlbum(html, "album-jacket-craft", archiveDetail);
  html = appendToGalleryAlbum(html, "album-cloth", archiveFabric);
  for (const figure of feedbackFigures) html = appendToGalleryAlbum(html, "album-appointments", figure);
  html = removeElementById(html, "section", "album-archive");
  html = removeElementById(html, "section", "album-client-feedback");
  const galleryIndex = `
<section class="st-gallery-numpad" aria-labelledby="st-gallery-numpad-title">
  <div class="st-gallery-shell">
    <header class="st-gallery-numpad__heading st-motion st-motion-1">
      <p class="st-gallery-kicker">THE HOUSE IN NINE FRAMES <span lang="vi">/ NHÀ MAY TRONG CHÍN KHUNG HÌNH</span></p>
      <h2 id="st-gallery-numpad-title">Move through the house.<span lang="vi">Đi qua từng lát cắt của nhà may.</span></h2>
      <p>Choose a chapter below to move directly to the photographs, cloth and fittings that define S.T Tailor.<span lang="vi">Chọn một chương để đi thẳng đến những hình ảnh, chất liệu và buổi thử đồ làm nên S.T Tailor.</span></p>
    </header>
    <nav class="st-gallery-numpad__grid" aria-label="Gallery chapters">
      <a href="#album-tuxedo" class="st-gallery-numpad__card st-motion st-motion-1"><span>01</span><strong>Evening tailoring</strong><em>Lễ phục</em><i>↗</i></a>
      <a href="#album-suits" class="st-gallery-numpad__card st-motion st-motion-2"><span>02</span><strong>Suits &amp; blazers</strong><em>Suit &amp; blazer</em><i>↗</i></a>
      <a href="#album-womenswear" class="st-gallery-numpad__card st-motion st-motion-3"><span>03</span><strong>Womenswear</strong><em>Trang phục nữ</em><i>↗</i></a>
      <a href="#album-shirts-trousers" class="st-gallery-numpad__card st-motion st-motion-2"><span>04</span><strong>Shirts &amp; trousers</strong><em>Sơ mi &amp; quần</em><i>↗</i></a>
      <a href="#album-jacket-craft" class="st-gallery-numpad__card st-motion st-motion-3"><span>05</span><strong>Jacket craft</strong><em>Kỹ nghệ áo khoác</em><i>↗</i></a>
      <a href="#album-cloth" class="st-gallery-numpad__card st-motion st-motion-4"><span>06</span><strong>The cloth library</strong><em>Thư viện chất liệu</em><i>↗</i></a>
      <a href="#album-fitting" class="st-gallery-numpad__card st-motion st-motion-3"><span>07</span><strong>The fitting room</strong><em>Phòng thử đồ</em><i>↗</i></a>
      <a href="#album-appointments" class="st-gallery-numpad__card st-motion st-motion-4"><span>08</span><strong>People &amp; appointments</strong><em>Con người &amp; lịch hẹn</em><i>↗</i></a>
      <a href="#album-showroom" class="st-gallery-numpad__card st-motion st-motion-5"><span>09</span><strong>The showroom</strong><em>Không gian nhà may</em><i>↗</i></a>
    </nav>
  </div>
</section>`;
  html = html.replace(/<section\s+aria-labelledby="album-tuxedo-title"/, `${galleryIndex}\n<section aria-labelledby="album-tuxedo-title"`);
  html = removeElementByClass(html, "section", "st-gallery-closing")
    .replace("<span>08</span> PEOPLE &amp; APPOINTMENTS", "<span>08</span> PEOPLE, APPOINTMENTS &amp; CLIENT FEEDBACK")
    .replace("A personal process, from welcome to final adjustment.<span lang=\"vi\">Một hành trình riêng, từ lời chào đón đến lần tinh chỉnh cuối cùng.</span>", "A personal process, from welcome to final adjustment.<span lang=\"vi\">Hành trình riêng từ lời chào đón đến lần tinh chỉnh cuối cùng.</span>");
  return replaceVisibleAtelier(applyGalleryAltText(html));
}

function transformPayment(html) {
  html = removeElementByClass(html, "section", "st-payment-terms");
  const compliance = `
  <section class="st-payment-compliance" aria-labelledby="st-payment-compliance-title">
    <div class="st-payment-shell">
      <header class="st-payment-compliance__head st-motion st-motion-1">
        <p class="st-page-kicker">PAYMENT &amp; ORDER TERMS / ĐIỀU KHOẢN THANH TOÁN &amp; ĐƠN HÀNG</p>
        <h2 id="st-payment-compliance-title">Clear before confirmation.<span lang="vi">Rõ ràng trước khi xác nhận.</span></h2>
        <p>These terms explain how S.T Tailor records payment for bespoke tailoring, alterations and showroom services. The written quotation and confirmed order remain the specific record for each commission.<span lang="vi">Các điều khoản này giải thích cách S.T Tailor ghi nhận thanh toán cho dịch vụ may đo, chỉnh sửa trang phục và dịch vụ tại showroom. Báo giá bằng văn bản và đơn hàng đã xác nhận là căn cứ cụ thể cho từng đơn may.</span></p>
      </header>
      <div class="st-payment-compliance__grid">
        <article class="st-motion st-motion-1"><span>01</span><h3>PRICE, CURRENCY &amp; FEES <b lang="vi">GIÁ, TIỀN TỆ &amp; CHI PHÍ</b></h3><p>The written quotation identifies the payable amount, currency, whether applicable taxes and delivery charges are included, any payment expressly agreed as a performance deposit, and the payment milestones before confirmation. A bank, card issuer, wallet or transfer provider may apply its own exchange rate or fee; any known S.T Tailor charge is disclosed before payment.<span lang="vi">Báo giá bằng văn bản ghi rõ số tiền, loại tiền tệ, giá đã bao gồm thuế và phí giao hàng áp dụng hay chưa, khoản nào được thỏa thuận là tiền đặt cọc bảo đảm thực hiện, cùng các mốc thanh toán trước khi xác nhận. Ngân hàng, tổ chức phát hành thẻ, ví điện tử hoặc đơn vị chuyển tiền có thể áp dụng tỷ giá hay phí riêng; mọi khoản phí do S.T Tailor biết sẽ được thông báo trước khi thanh toán.</span></p></article>
        <article class="st-motion st-motion-2"><span>02</span><h3>DEPOSIT &amp; ORDER RECORD <b lang="vi">ĐẶT CỌC &amp; XÁC NHẬN ĐƠN</b></h3><p>Production or cloth reservation begins after the order terms are confirmed and the required deposit has cleared. The deposit amount and payment schedule follow the written quotation; no universal deposit rate applies unless it is stated for that order.<span lang="vi">Việc giữ vải hoặc sắp xếp sản xuất bắt đầu sau khi điều khoản đơn hàng được xác nhận và khoản đặt cọc cần thiết đã được ghi có. Mức cọc và lịch thanh toán theo báo giá bằng văn bản; không áp dụng một tỷ lệ cọc chung nếu đơn hàng không ghi rõ.</span></p></article>
        <article class="st-motion st-motion-3"><span>03</span><h3>PAYMENT CONFIRMATION <b lang="vi">XÁC NHẬN THANH TOÁN</b></h3><p>Payment is recorded after confirmation from the relevant bank or provider. A transfer screenshot helps reconciliation but does not by itself confirm cleared funds. S.T Tailor may request proportionate transaction details to resolve errors or suspected fraud.<span lang="vi">Thanh toán được ghi nhận sau khi có xác nhận từ ngân hàng hoặc đơn vị cung cấp liên quan. Ảnh chụp giao dịch hỗ trợ đối soát nhưng không tự thay thế xác nhận tiền đã ghi có. S.T Tailor có thể yêu cầu thông tin giao dịch ở mức cần thiết để xử lý sai sót hoặc dấu hiệu gian lận.</span></p></article>
        <article class="st-motion st-motion-4"><span>04</span><h3>CANCELLATION, ERROR &amp; REFUND <b lang="vi">HỦY, SAI SÓT &amp; HOÀN TIỀN</b></h3><p>Cancellation and refund requests are reviewed against the confirmed order, work completed and materials committed, without limiting mandatory consumer rights. Duplicate or incorrect payments are reconciled using the transaction record; an approved refund returns through the original channel where supported, or another lawful method agreed in writing. Bank or provider processing time may apply.<span lang="vi">Yêu cầu hủy hoặc hoàn tiền được xem xét theo đơn hàng đã xác nhận, phần việc đã thực hiện và vật liệu đã cam kết, đồng thời không hạn chế các quyền bắt buộc của người tiêu dùng. Khoản thanh toán trùng hoặc sai được đối soát theo chứng từ giao dịch; khoản hoàn tiền đã được chấp thuận sẽ đi qua kênh ban đầu khi được hỗ trợ hoặc qua phương thức hợp pháp khác được thống nhất bằng văn bản. Thời gian xử lý của ngân hàng hoặc đơn vị cung cấp có thể được áp dụng.</span></p></article>
        <article class="st-motion st-motion-5"><span>05</span><h3>RECEIPT &amp; ELECTRONIC INVOICE <b lang="vi">CHỨNG TỪ &amp; HÓA ĐƠN ĐIỆN TỬ</b></h3><p>Provide the correct purchaser name, address, tax code and invoice email before invoice issuance when an invoice is required. S.T Tailor issues payment records and electronic invoices in line with the confirmed transaction and applicable Vietnamese tax and invoice rules.<span lang="vi">Khi cần hóa đơn, vui lòng cung cấp đúng tên người mua, địa chỉ, mã số thuế và email nhận hóa đơn trước thời điểm lập hóa đơn. S.T Tailor lập chứng từ thanh toán và hóa đơn điện tử theo giao dịch đã xác nhận cùng quy định thuế, hóa đơn hiện hành của Việt Nam.</span></p></article>
        <article class="st-motion st-motion-6"><span>06</span><h3>DATA &amp; PAYMENT SECURITY <b lang="vi">DỮ LIỆU &amp; AN TOÀN THANH TOÁN</b></h3><p>Only transaction information reasonably needed to verify and service the order should be shared. Card credentials and wallet authorisation are handled through the relevant bank or payment provider where that channel is used. Never send a password, PIN, OTP or banking login through chat or email.<span lang="vi">Chỉ nên chia sẻ thông tin giao dịch cần thiết để xác minh và phục vụ đơn hàng. Khi sử dụng thẻ hoặc ví, thông tin xác thực được xử lý qua ngân hàng hoặc đơn vị thanh toán liên quan. Không gửi mật khẩu, mã PIN, OTP hoặc thông tin đăng nhập ngân hàng qua tin nhắn hay email.</span></p></article>
      </div>
      <div class="st-payment-compliance__law st-motion st-motion-2">
        <div><p class="st-page-kicker">VIETNAM LEGAL FRAMEWORK / CĂN CỨ PHÁP LUẬT VIỆT NAM</p><p>This page follows the current framework for consumer protection, electronic transactions, non-cash payments, electronic invoices and personal-data protection. It provides general operating information and does not reduce rights granted by mandatory law.<span lang="vi">Trang này tuân theo khung pháp lý hiện hành về bảo vệ người tiêu dùng, giao dịch điện tử, thanh toán không dùng tiền mặt, hóa đơn điện tử và bảo vệ dữ liệu cá nhân. Nội dung cung cấp thông tin vận hành chung và không làm giảm các quyền được pháp luật bắt buộc bảo vệ.</span></p></div>
        <ul>
          <li><a href="https://vanban.chinhphu.vn/?classid=1&amp;docid=208363&amp;orggroupid=1&amp;pageid=27160&amp;previousPage=other+articles" target="_blank" rel="noopener external">Law 19/2023/QH15 <span lang="vi">Luật Bảo vệ quyền lợi người tiêu dùng</span></a></li>
          <li><a href="https://vanban.chinhphu.vn/?classid=1&amp;docid=208421&amp;pageid=27160&amp;typegroupid=3" target="_blank" rel="noopener external">Law 20/2023/QH15 <span lang="vi">Luật Giao dịch điện tử</span></a></li>
          <li><a href="https://vanban.chinhphu.vn/?classid=1&amp;docid=210262&amp;orggroupid=2&amp;pageid=27160" target="_blank" rel="noopener external">Decree 52/2024/NĐ-CP <span lang="vi">Thanh toán không dùng tiền mặt</span></a></li>
          <li><a href="https://vanban.chinhphu.vn/?docid=213179&amp;lang=vi&amp;pageid=27160" target="_blank" rel="noopener external">Decree 70/2025/NĐ-CP <span lang="vi">Hóa đơn, chứng từ</span></a></li>
          <li><a href="https://vanban.chinhphu.vn/?classid=1&amp;docid=214590&amp;pageid=27160" target="_blank" rel="noopener external">Law 91/2025/QH15 <span lang="vi">Luật Bảo vệ dữ liệu cá nhân</span></a></li>
        </ul>
      </div>
    </div>
  </section>`;
  const gallerySuite = `
  <section class="st-payment-gallery-suite" aria-labelledby="st-payment-gallery-suite-title">
    <div class="st-payment-shell">
      <a class="st-payment-gallery-suite__frame" href="/gallery/" aria-describedby="st-payment-gallery-suite-description">
        <figure class="st-motion st-motion-1"><img src="/media/2026/09/st-tailor-gallery-showroom-tailoring-display.jpg" alt="Navy suit and womenswear displayed inside S.T Tailor | Suit xanh navy và trang phục nữ trưng bày tại S.T Tailor" width="1080" height="1920" loading="lazy" decoding="async"></figure>
        <span class="st-payment-gallery-suite__copy st-motion st-motion-2">
          <small>BEYOND THE TRANSACTION <span lang="vi">SAU MỖI GIAO DỊCH</span></small>
          <strong id="st-payment-gallery-suite-title">See what each commission becomes.<span lang="vi">Khám phá thành phẩm sau mỗi đơn may.</span></strong>
          <span id="st-payment-gallery-suite-description">ENTER THE GALLERY <b lang="vi">ĐẾN THƯ VIỆN HÌNH ẢNH</b><i aria-hidden="true">→</i></span>
        </span>
      </a>
    </div>
  </section>`;
  html = html.replace('  <section class="st-payment-security"', `${compliance}\n${gallerySuite}\n\n  <section class="st-payment-security"`);
  return replaceVisibleAtelier(html);
}

function transformAbout(html) {
  html = removeElementByClass(html, "section", "st-lux-gallery-redirect");
  html = removeElementByClass(html, "section", "st-lux-appointment");
  html = html
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
      <p>At our 258 Lê Thánh Tôn showroom, a consultation connects the occasion, cloth, fit and finishing before an order is confirmed.<span lang="vi">Tại showroom 258 Lê Thánh Tôn, buổi tư vấn kết nối dịp sử dụng, chất liệu, phom dáng và hoàn thiện trước khi xác nhận đơn may.</span></p>
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
      <figure><img src="/media/2026/09/st-tailor-floral-dinner-jacket-showroom.png" alt="Magenta and violet floral dinner jacket in the S.T Tailor showroom | Áo khoác dự tiệc floral tông hồng tím tại showroom S.T Tailor" width="1086" height="1448" loading="lazy" decoding="async"></figure>
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

function transformPage(sourceFile, html) {
  const transforms = {
    "Home.html": transformHome,
    "Services.html": transformServices,
    "Pricing.html": transformPricing,
    "Contact.html": transformContact,
    "Gallery.html": transformGallery,
    "Payment.html": transformPayment,
    "About.html": transformAbout,
    "Error.html": transformError
  };
  return (transforms[sourceFile] ?? replaceVisibleAtelier)(html);
}

function imageMetadata(html) {
  return [...html.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^\"]+)"[^>]*>/gi)].map((match) => ({
    src: match[1],
    alt: /\balt="([^\"]*)"/i.exec(match[0])?.[1] ?? ""
  }));
}

function enrichImageAttributes(html, { responsiveSizes } = {}) {
  const localImages = html.replace(/<img\b[^>]*\bsrc="(\/media\/[^\"]+)"[^>]*>/gi, (tag, src) => {
    const asset = decodeURIComponent(src.replace(/^\/media\//, ""));
    const metadata = imageManifest[asset];
    if (!metadata) return tag;
    let output = tag;
    if (!/\bwidth="\d+"/i.test(output)) output = output.replace(/<img\b/i, `<img width="${metadata.width}"`);
    if (!/\bheight="\d+"/i.test(output)) output = output.replace(/<img\b/i, `<img height="${metadata.height}"`);
    if (!/\bdecoding=/i.test(output)) output = output.replace(/<img\b/i, '<img decoding="async"');
    if (responsiveSizes && metadata.responsive?.length && !/\bsrcset=/i.test(output)) {
      const srcset = metadata.responsive.map(({ src: candidate, width }) => `${candidate} ${width}w`).join(", ");
      output = output.replace(/<img\b/i, `<img srcset="${srcset}" sizes="${responsiveSizes}"`);
    }
    return output;
  });
  return localImages.replace(/<img\b[^>]*\bsrc="\/icons\/[^\"]+"[^>]*>/gi, (tag) => {
    let output = tag;
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
const sharedContentModified = "2026-09-23";

function lastModifiedFor(sourceFile) {
  const contentFile = path.join("source", "wordpress", sourceFile);
  const dirty = spawnSync("git", ["status", "--porcelain", "--", contentFile], { cwd: root, encoding: "utf8" });
  if (dirty.status !== 0 || dirty.stdout.trim()) return buildDate;
  const history = spawnSync("git", ["log", "-1", "--format=%cs", "--", contentFile], { cwd: root, encoding: "utf8" });
  const date = history.status === 0 ? history.stdout.trim() : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? (date > sharedContentModified ? date : sharedContentModified) : buildDate;
}

function header(activePath) {
  const nav = primaryNavigation.map(([href, label]) => `<a href="${href}"${activePath === href ? " aria-current=\"page\"" : ""}>${label}</a>`).join("");
  return `<a class="st-skip-link" href="#main-content">Skip to content</a>
<header class="st-site-header"><div class="st-site-header__bar">
  <a class="st-site-brand" href="/" aria-label="S.T Tailor home"><img src="/media/2026/09/logo-sttailor.png" alt="S.T Tailor" width="1239" height="1269" decoding="async"></a>
  <button class="st-nav-toggle" type="button" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false" aria-keyshortcuts="Alt+M" title="Menu · Alt+M" data-nav-toggle><i></i><i></i><i></i></button>
  <nav id="primary-navigation" class="st-site-nav" aria-label="Primary navigation" data-site-nav>${nav}</nav>
</div></header>`;
}

function footer() {
  return transformFooter(readSource("Footer.html"));
}

function documentFor(route, sourceFile, title, description, shareImage, shareImageAlt, lastModified) {
  const responsiveSizes = route === "/gallery/"
    ? "(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw"
    : route === "/"
      ? "(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 20vw"
      : "(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 800px";
  const body = enrichImageAttributes(transformPage(sourceFile, readSource(sourceFile)), { responsiveSizes });
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
    address: { "@type": "PostalAddress", streetAddress: "258 Lê Thánh Tôn, Phường Tân Định", addressLocality: "Ho Chi Minh City", addressRegion: "Ho Chi Minh City", addressCountry: "VN" },
    geo: { "@type": "GeoCoordinates", latitude: 10.7720874, longitude: 106.6957664 },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "09:00", closes: "20:00" }],
    areaServed: [{ "@type": "City", name: "Ho Chi Minh City" }, { "@type": "Country", name: "Vietnam" }],
    contactPoint: { "@type": "ContactPoint", telephone: "+84 909 556 258", email: "contact.sttailor@gmail.com", contactType: "customer service", areaServed: "VN", availableLanguage: ["Vietnamese", "English"] },
    priceRange: "$$$",
    currenciesAccepted: "VND, USD",
    paymentAccepted: "Credit Card, Debit Card, Visa, Mastercard, American Express, JCB, Apple Pay, Google Pay, Samsung Pay, PayPal, Wise",
    hasMap: "https://maps.app.goo.gl/j8N26uiQUC4J95vT6",
    knowsAbout: ["Bespoke tailoring", "Clothing alterations", "European suiting cloth", "Vietnamese silk", "Fittings and pattern cutting"],
    sameAs: ["https://facebook.com/sttailor.hcm/", "https://www.instagram.com/sttailorhcm/", "https://wa.me/84909556258", "https://zalo.me/0909556258", "https://www.linkedin.com/company/sttailorhcm/", "https://youtube.com/@S.Ttailor", "https://www.tiktok.com/@sttailorhcm", "https://pinterest.com/sttailorhcm/", "https://x.com/sttalior"]
  };
  business.makesOffer = {
    "@type": "OfferCatalog",
    name: "S.T Tailor services",
    itemListElement: ["Bespoke suits and vests", "Blazers and separates", "Shirts and trousers", "Formalwear", "Womenswear", "Wedding and traditional clothing", "Clothing alterations", "Cloth consultation"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, provider: { "@id": "https://sttailor.com/#business" } } }))
  };
  const pageType = route === "/gioi-thieu/" ? "AboutPage" : route === "/lien-he/" ? "ContactPage" : ["/gallery/", "/cam-nang-may-do/"].includes(route) ? "CollectionPage" : "WebPage";
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
  if (route === "/cam-nang-may-do/") {
    graph.push({ "@type": "ItemList", "@id": `${canonical}#guides`, name: "S.T Tailor tailoring guide | Cẩm nang may đo S.T Tailor", numberOfItems: guideRoutes.length, itemListElement: guideRoutes.map(([url, english, vietnamese], index) => ({ "@type": "ListItem", position: index + 1, name: `${english} | ${vietnamese}`, url: `https://sttailor.com${url}` })) });
    webPage.mainEntity = { "@id": `${canonical}#guides` };
  }
  if (guideRoutes.some(([guideRoute]) => guideRoute === route)) {
    graph.push({ "@type": "Article", "@id": `${canonical}#article`, headline: title.split(" | ")[0], description, image: `https://sttailor.com${shareImage}`, author: { "@id": "https://sttailor.com/#business" }, publisher: { "@id": "https://sttailor.com/#business" }, mainEntityOfPage: { "@id": `${canonical}#webpage` }, dateModified: lastModified, inLanguage: ["en", "vi"] });
    webPage.mainEntity = { "@id": `${canonical}#article` };
  }
  if (route !== "/") {
    const isGuideArticle = guideRoutes.some(([guideRoute]) => guideRoute === route);
    const itemListElement = isGuideArticle
      ? [{ "@type": "ListItem", position: 1, name: "Home", item: "https://sttailor.com/" }, { "@type": "ListItem", position: 2, name: "Tailoring guide", item: "https://sttailor.com/cam-nang-may-do/" }, { "@type": "ListItem", position: 3, name: title.split(" | ")[0], item: canonical }]
      : [{ "@type": "ListItem", position: 1, name: "Home", item: "https://sttailor.com/" }, { "@type": "ListItem", position: 2, name: title.split(" | ")[0], item: canonical }];
    graph.push({ "@type": "BreadcrumbList", itemListElement });
  }
  const jsonLd = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
  const safeTitle = title.replaceAll('"', "&quot;");
  const safeDescription = description.replaceAll('"', "&quot;");
  const safeImageAlt = shareImageAlt.replaceAll('"', "&quot;");
  const shareImageUrl = `https://sttailor.com${shareImage}`;
  const imageType = /\.webp$/i.test(shareImage) ? "image/webp" : "image/jpeg";
  const heroPreload = route === "/" ? `<link rel="preload" as="image" href="${shareImage}" imagesrcset="/media/_responsive/2026/06/background-hero-trang-lien-he-sttailor-768.webp 768w, ${shareImage} 1717w" imagesizes="100vw" fetchpriority="high">` : "";
  const siteHeader = enrichImageAttributes(header(route), { responsiveSizes: "102px" });
  const siteFooter = enrichImageAttributes(footer(), { responsiveSizes: "160px" });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${safeDescription}"><meta name="author" content="S.T Tailor"><meta name="application-name" content="S.T Tailor"><meta name="sttailor-build-revision" content="${buildRevision}"><meta name="color-scheme" content="light"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="google-site-verification" content="e1RyHPdDirO6wJIxuZKKSIY6EXYb37XMfktIVl3aJz8"><meta name="p:domain_verify" content="78c108c3384a3aa9201fb90b99f0b225"><link rel="canonical" href="${canonical}"><link rel="icon" href="/media/2026/09/logo-sttailor.png" type="image/png"><link rel="apple-touch-icon" href="/media/2026/09/logo-sttailor.png"><link rel="manifest" href="/site.webmanifest">${heroPreload}<meta property="og:title" content="${safeTitle}"><meta property="og:description" content="${safeDescription}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="S.T Tailor"><meta property="og:locale" content="en_US"><meta property="og:locale:alternate" content="vi_VN"><meta property="og:image" content="${shareImageUrl}"><meta property="og:image:type" content="${imageType}"><meta property="og:image:alt" content="${safeImageAlt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${safeTitle}"><meta name="twitter:description" content="${safeDescription}"><meta name="twitter:image" content="${shareImageUrl}"><meta name="twitter:image:alt" content="${safeImageAlt}"><meta name="theme-color" content="#ead1ad"><title>${safeTitle}</title>${jsonLd}${analyticsTags}<link rel="stylesheet" href="${stylesheetHref}"></head><body><div class="st-site-frame">${siteHeader}<main id="main-content">${body}</main>${siteFooter}</div><script type="module" src="${scriptHref}"></script></body></html>`;
}

function collectAssetPaths() {
  const sourceFiles = [...routes.map(([, file]) => file), "Error.html", "Footer.html"];
  const content = [...sourceFiles.map((file) => readFileSync(path.join(sourceRoot, file), "utf8")), readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8")].join("\n");
  const matcher = /https?:\/\/sttailor\.com\/wp-content\/uploads\/([^\"' )]+)/g;
  const found = new Set(["2026/09/logo-sttailor.png", "2026/09/logo-sttailor-1000x1024.png"]);
  for (const match of content.matchAll(matcher)) found.add(match[1]);
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
  const result = spawnSync("python", [path.join(root, "scripts", "build-image-manifest.py"), sourceMedia, path.join(dist, "image-manifest.json")], { encoding: "utf8" });
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
copyIcons();
const imageCount = buildImageManifest();
mkdirSync(path.join(dist, "styles"), { recursive: true });
mkdirSync(path.join(dist, "scripts"), { recursive: true });

const wordpressCss = readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8").replaceAll("https://sttailor.com/wp-content/uploads/", "/media/");
const standaloneCss = readFileSync(path.join(root, "src", "styles", "standalone-shell.css"), "utf8");
const fullCustomCss = `${wordpressCss}\n\n/* Cloudflare Worker standalone shell. WordPress page CSS above remains the visual source of truth. */\n${standaloneCss}\n`;
// The editable export remains complete for owner maintenance. Only the served
// asset is minified, and its content hash keeps its immutable cache safe.
const productionCss = minifyCss({ filename: "site.css", code: Buffer.from(fullCustomCss), minify: true }).code.toString();
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
const notFoundDocument = documentFor("/", "Error.html", "Page not found | S.T Tailor", "The requested S.T Tailor page was not found.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom in Ho Chi Minh City", lastModifiedFor("Error.html"))
  .replace(/<meta name="robots" content="[^"]+">/, '<meta name="robots" content="noindex, follow">')
  .replace(/<meta name="googlebot" content="[^"]+">/, '<meta name="googlebot" content="noindex, follow">')
  .replace(/<link rel="canonical" href="[^"]+">/, "")
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
writeFileSync(path.join(dist, "404.html"), notFoundDocument, "utf8");
writeFileSync(path.join(dist, "not-found.html"), notFoundDocument, "utf8");
writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /build-manifest.json\nSitemap: https://sttailor.com/sitemap.xml\n", "utf8");
writeFileSync(path.join(dist, indexNowKeyFile), `${indexNowKey}\n`, "utf8");
const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const publishedImageLocations = new Set();
const sitemapRouteOrder = [routes.find(([route]) => route === "/gallery/"), ...routes.filter(([route]) => route !== "/gallery/")];
const sitemapEntries = sitemapRouteOrder.map(([route, , , , shareImage, shareImageAlt]) => {
  const pagePath = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  const pageHtml = readFileSync(pagePath, "utf8");
  const imageMap = new Map([[shareImage, shareImageAlt]]);
  for (const match of pageHtml.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^"]+)"[^>]*>/gi)) {
    if (route === "/gallery/" && /(?:logo-sttailor|LinkedInLogo)/i.test(match[1])) continue;
    const alt = /\balt="([^"]*)"/i.exec(match[0])?.[1] || "S.T Tailor";
    if (!imageMap.has(match[1])) imageMap.set(match[1], alt);
  }
  const pageImages = [...imageMap].filter(([src]) => {
    if (publishedImageLocations.has(src)) return false;
    publishedImageLocations.add(src);
    return true;
  });
  const imageEntries = pageImages.slice(0, 1000).map(([src, alt]) => `<image:image><image:loc>https://sttailor.com${xmlEscape(src)}</image:loc><image:title>${xmlEscape(alt)}</image:title></image:image>`).join("");
  return `\n  <url><loc>https://sttailor.com${route}</loc><lastmod>${routeLastModified.get(route) ?? buildDate}</lastmod>${imageEntries}</url>`;
}).join("");
writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${sitemapEntries}\n</urlset>\n`, "utf8");
writeFileSync(path.join(dist, "site.webmanifest"), JSON.stringify({ name: "S.T Tailor", short_name: "S.T Tailor", description: "Bespoke tailoring and clothing alterations in Ho Chi Minh City.", start_url: "/", scope: "/", display: "standalone", background_color: "#f3e1c5", theme_color: "#ead1ad", icons: [{ src: "/media/2026/09/logo-sttailor.png", sizes: "any", type: "image/png", purpose: "any maskable" }] }, null, 2), "utf8");
writeFileSync(path.join(dist, "llms.txt"), "# S.T Tailor\n\nS.T Tailor is a bespoke tailoring and clothing alterations house at 258 Le Thanh Ton, Phuong Tan Dinh, Ho Chi Minh City, Vietnam.\n\n- Website: https://sttailor.com/\n- Services: https://sttailor.com/dich-vu/\n- Gallery: https://sttailor.com/gallery/\n- Pricing: https://sttailor.com/bang-gia/\n- Payment methods: https://sttailor.com/phuong-thuc-thanh-toan/\n- Returns and refunds: https://sttailor.com/doi-tra-hoan-tien/\n- Shipping and delivery: https://sttailor.com/chinh-sach-van-chuyen/\n- Terms and conditions: https://sttailor.com/dieu-khoan-dieu-kien/\n- Privacy policy: https://sttailor.com/chinh-sach-bao-mat/\n- Tailoring guide: https://sttailor.com/cam-nang-may-do/\n- Choosing cloth: https://sttailor.com/chon-vai-may-do/\n- Fitting process: https://sttailor.com/quy-trinh-thu-do/\n- Clothing alterations: https://sttailor.com/chinh-sua-trang-phuc/\n- Garment care and cleaning: https://sttailor.com/bao-quan-giat-la/\n- Contact: https://sttailor.com/lien-he/\n- Telephone: +84 909 556 258\n- Email: contact.sttailor@gmail.com\n", "utf8");
writeFileSync(path.join(dist, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n  Strict-Transport-Security: max-age=15552000\n  Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests\n", "utf8");
writeFileSync(path.join(dist, "build-manifest.json"), JSON.stringify({ source: "source/wordpress", sourceMedia: "source/media", revision: buildRevision, routes: routes.map(([route]) => route), localUploadAssets: assets.length, imageMetadata: imageCount, galleryDuplicateCheck: "passed" }, null, 2), "utf8");
console.log(`Built ${routes.length} routes from the versioned WordPress reference with ${assets.length} local upload assets and dimensions for ${imageCount} images.`);
