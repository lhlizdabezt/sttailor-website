import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// This directory is intentionally read-only. It is the approved WordPress
// reference supplied by the owner; the Worker output is derived from it.
const sourceRoot = path.join(root, "source", "wordpress");
const sourceMedia = path.join(root, "source", "media");
const dist = path.join(root, "dist");
let stylesheetHref = "/styles/site.css";
let scriptHref = "/scripts/site.js";

const routes = [
  ["/", "Home.html", "S.T Tailor | Bespoke Tailoring in Ho Chi Minh City", "Bespoke suits, shirts, formalwear and alterations at 258 Lê Thánh Tôn, Ho Chi Minh City. Private consultations available.", "/media/2026/06/background-hero-trang-lien-he-sttailor.webp", "Private fitting at S.T Tailor in Ho Chi Minh City"],
  ["/gioi-thieu/", "About.html", "About S.T Tailor | Bespoke Tailoring & Alterations in HCMC", "Meet S.T Tailor in Ho Chi Minh City for bespoke suits, formalwear, clothing alterations, British and Italian cloth, Vietnamese silk and private fittings.", "/media/2026/09/fabric-focus-cloth-books.jpg", "Tailoring cloth books selected at S.T Tailor"],
  ["/dich-vu/", "Services.html", "Bespoke Tailoring & Alterations in HCMC | S.T Tailor", "Explore bespoke suits, shirts, formalwear, womenswear, fittings and clothing alterations by S.T Tailor in central Ho Chi Minh City.", "/media/2026/09/st-tailor-client-shoulder-fitting.jpg", "Shoulder fitting during the S.T Tailor bespoke process"],
  ["/gallery/", "Gallery.html", "Bespoke Tailoring Gallery in HCMC | S.T Tailor", "View S.T Tailor's cloth, fittings, suits, formalwear, womenswear, garment details and showroom in Ho Chi Minh City.", "/media/2026/09/st-tailor-gallery-showroom-tailoring-display.jpg", "S.T Tailor showroom and tailoring display"],
  ["/bang-gia/", "Pricing.html", "Bespoke Tailoring Prices in HCMC | S.T Tailor", "Review starting prices for bespoke suits, shirts, formalwear and clothing alterations before consulting S.T Tailor in Ho Chi Minh City.", "/media/2026/09/st-tailor-navy-double-breasted-front.jpeg", "Navy double-breasted suit by S.T Tailor"],
  ["/phuong-thuc-thanh-toan/", "Payment.html", "Payment Methods for Tailoring | S.T Tailor HCMC", "View accepted cards, bank transfer, digital wallets and international payment options for S.T Tailor commissions in Ho Chi Minh City.", "/media/2026/06/store-sttailor-2.webp", "S.T Tailor showroom in Ho Chi Minh City"],
  ["/lien-he/", "Contact.html", "Contact S.T Tailor HCMC | Private Consultation", "Contact S.T Tailor by telephone, email, Messenger, Zalo, Instagram or WhatsApp and arrange a private tailoring consultation.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom at 258 Lê Thánh Tôn" ]
];

function readSource(file) {
  return readFileSync(path.join(sourceRoot, file), "utf8")
    .replaceAll("https://sttailor.com/wp-content/uploads/", "/media/")
    .replaceAll("https://sttailor.com/", "/");
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
  return html.replace(/\s*<\/section>\s*$/, `${editorial}\n</section>`);
}

function transformFooter(html) {
  html = removeElementByClass(html, "div", "st-footer-v7__top")
    .replace('loading="eager"', 'loading="lazy"')
    .replace(/\s*<a href="tel:[^"]+">[\s\S]*?<\/a>/, "")
    .replace(/\s*<a href="mailto:[^"]+">[\s\S]*?<\/a>/, "")
    .replace(/\s*<a href="(?:https:\/\/sttailor\.com)?\/refund_returns\/">[\s\S]*?<\/a>/, "")
    .replace(/\s*<div class="st-footer-v7__bottom">[\s\S]*?<\/div>\s*<\/footer>/, "\n</footer>")
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
      <div class="st-bespoke-process__actions"><a href="/lien-he/">ARRANGE A CONSULTATION <span lang="vi">ĐẶT LỊCH TƯ VẤN</span></a><a href="/bang-gia/">VIEW STARTING PRICES <span lang="vi">XEM BẢNG GIÁ</span></a></div>
    </div>
  </section>`;
  html = html.replace('  <aside class="st-service-booking"', `${bespokeProcess}\n\n  <aside class="st-service-booking"`);
  return replaceVisibleAtelier(html);
}

function transformPricing(html) {
  html = removeElementByClass(html, "header", "stpr-hero")
    .replace(/\s*<p>Each starting price is a guide[\s\S]*?<\/p>/, "")
    .replace("THE ATELIER GALLERY <span lang=\"vi\">THƯ VIỆN ATELIER</span>", "PRIVATE CONSULTATION <span lang=\"vi\">TƯ VẤN VÀ BÁO GIÁ</span>")
    .replace("See the references behind each commission.<span lang=\"vi\">Khám phá cảm hứng phía sau mỗi đơn may.</span>", "Let us prepare your quotation.<span lang=\"vi\">Nhận tư vấn và báo giá.</span>")
    .replace("Explore tailoring, cloth and finished work before a conversation.<span lang=\"vi\">Khám phá may đo, chất liệu và sản phẩm hoàn thiện trước khi trao đổi.</span>", "Discuss cloth, design and timing with S.T Tailor before your order is confirmed.<span lang=\"vi\">Trao đổi chất liệu, thiết kế và thời gian cùng S.T Tailor trước khi xác nhận đơn hàng.</span>")
    .replace(/href="https:\/\/sttailor\.com\/gallery\/"/, 'href="/lien-he/"')
    .replace(/EXPLORE THE GALLERY[\s\S]*?<\/a>/, 'BOOK A CONSULTATION <span lang="vi">ĐẶT LỊCH TƯ VẤN</span></a>');
  html = removeElementByClass(html, "section", "stpr-notes");
  html = removeElementByClass(html, "section", "stpr-cta");
  return replaceVisibleAtelier(html);
}

function transformContact(html) {
  html = removeElementByClass(html, "section", "st-contact-hero")
    .replace(/\s*<p>Tell us what you are dressing for\.[\s\S]*?<\/p>/, "")
    .replace(/\s*<section class="st-contact-gallery-redirect"[\s\S]*?<\/section>/, "")
    .replace(/\s*<p class="st-contact-summary">[\s\S]*?<\/p>/, "")
    .replace(/\s*<div class="st-contact-line small"><\/div>/, "");
  for (const className of ["st-contact-card--linkedin", "st-contact-card--pinterest", "st-contact-card--youtube", "st-contact-card--tiktok"]) {
    html = removeElementByClass(html, "article", className);
  }
  html = html.replace(
    /<article class="st-contact-card st-contact-card--facebook">[\s\S]*?<\/article>/,
    '<article class="st-contact-card st-contact-card--messenger"><span class="st-contact-card__icon"><img src="https://cdn.simpleicons.org/messenger/0084FF" alt="" aria-hidden="true"></span><h3>MESSENGER <span lang="vi">NHẮN TIN MESSENGER</span></h3><p>S.T Tailor HCM<span lang="vi">Trao đổi trực tiếp với S.T Tailor</span></p><a href="https://m.me/sttailor.hcm" target="_blank" rel="noopener noreferrer">MESSAGE S.T TAILOR&nbsp;/&nbsp;<span lang="vi">NHẮN TIN NGAY</span></a></article>'
  );
  return replaceVisibleAtelier(html);
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
  return replaceVisibleAtelier(html);
}

function transformPayment(html) {
  return replaceVisibleAtelier(removeElementByClass(html, "section", "st-policy-refund-link"));
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
      "From structured British cloth to expressive Italian selections—including Vitale Barberis Canonico—and Vietnamese silk, every material is considered against climate, movement and occasion.<span lang=\"vi\">Từ vải Anh giàu cấu trúc, vải Ý tinh tế—including Vitale Barberis Canonico—đến lụa tơ tằm Việt Nam, mỗi chất liệu đều được cân nhắc theo khí hậu, chuyển động và dịp sử dụng.</span>"
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
      <a class="st-motion st-motion-2" href="/dich-vu/"><strong>CLOTHING ALTERATIONS <span lang="vi">CHỈNH SỬA TRANG PHỤC</span></strong><small>Practical refinements for garments you already own.<span lang="vi">Tinh chỉnh thực tế cho trang phục sẵn có.</span></small><i aria-hidden="true">→</i></a>
      <a class="st-motion st-motion-3" href="/lien-he/"><strong>PRIVATE CONSULTATION <span lang="vi">ĐẶT LỊCH TƯ VẤN</span></strong><small>Telephone, Messenger, Zalo, Instagram or WhatsApp.<span lang="vi">Điện thoại, Messenger, Zalo, Instagram hoặc WhatsApp.</span></small><i aria-hidden="true">→</i></a>
    </nav>
  </div>
</section>`;
  html = `${html.slice(0, provenanceRange.end)}${clothHeritage}${consultationGuide}${html.slice(provenanceRange.end)}`;
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

function header(activePath) {
  const navItems = [
    ["/gioi-thieu/", "About"],
    ["/dich-vu/", "Services"],
    ["/gallery/", "Gallery"],
    ["/bang-gia/", "Pricing"],
    ["/phuong-thuc-thanh-toan/", "Payment methods"],
    ["/lien-he/", "Contact"]
  ];
  const nav = navItems.map(([href, label]) => `<a href="${href}"${activePath === href ? " aria-current=\"page\"" : ""}>${label}</a>`).join("");
  return `<a class="st-skip-link" href="#main-content">Skip to content</a>
<header class="st-site-header"><div class="st-site-header__bar">
  <a class="st-site-brand" href="/" aria-label="S.T Tailor home"><img src="/media/2026/09/logo-sttailor.png" alt="S.T Tailor" width="1239" height="1269" decoding="async" fetchpriority="high"></a>
  <button class="st-nav-toggle" type="button" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false" aria-keyshortcuts="Alt+M" title="Menu · Alt+M" data-nav-toggle><i></i><i></i><i></i></button>
  <nav id="primary-navigation" class="st-site-nav" aria-label="Primary navigation" data-site-nav>${nav}</nav>
</div></header>`;
}

function footer() {
  return transformFooter(readSource("Footer.html"));
}

function documentFor(route, sourceFile, title, description, shareImage, shareImageAlt) {
  const body = transformPage(sourceFile, readSource(sourceFile));
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
    address: { "@type": "PostalAddress", streetAddress: "258 Lê Thánh Tôn, Phường Tân Định", addressLocality: "Ho Chi Minh City", addressCountry: "VN" },
    geo: { "@type": "GeoCoordinates", latitude: 10.7720874, longitude: 106.6957664 },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "09:00", closes: "20:00" }],
    areaServed: [{ "@type": "City", name: "Ho Chi Minh City" }, { "@type": "Country", name: "Vietnam" }],
    contactPoint: { "@type": "ContactPoint", telephone: "+84 909 556 258", email: "contact.sttailor@gmail.com", contactType: "customer service", areaServed: "VN", availableLanguage: ["Vietnamese", "English"] },
    priceRange: "$$$",
    currenciesAccepted: "VND, USD",
    paymentAccepted: "Credit Card, Debit Card, Visa, Mastercard, American Express, JCB, Apple Pay, Google Pay, Samsung Pay, PayPal, Wise",
    hasMap: "https://maps.app.goo.gl/j8N26uiQUC4J95vT6",
    knowsAbout: ["Bespoke tailoring", "Clothing alterations", "European suiting cloth", "Vietnamese silk", "Fittings and pattern cutting"],
    sameAs: ["https://facebook.com/sttailor.hcm/", "https://www.instagram.com/sttailorhcm/", "https://wa.me/84909556258", "https://zalo.me/0909556258", "https://www.linkedin.com/company/sttailorhcm/", "https://youtube.com/@S.Ttailor", "https://www.tiktok.com/@sttailorhcm", "https://pinterest.com/sttailorhcm/"]
  };
  business.makesOffer = {
    "@type": "OfferCatalog",
    name: "S.T Tailor services",
    itemListElement: ["Bespoke suits and vests", "Blazers and separates", "Shirts and trousers", "Formalwear", "Womenswear", "Wedding and traditional clothing", "Clothing alterations", "Cloth consultation"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, provider: { "@id": "https://sttailor.com/#business" } } }))
  };
  const pageType = route === "/gioi-thieu/" ? "AboutPage" : route === "/lien-he/" ? "ContactPage" : route === "/gallery/" ? "CollectionPage" : "WebPage";
  const graph = [
    business,
    { "@type": "WebSite", "@id": "https://sttailor.com/#website", url: "https://sttailor.com/", name: "S.T Tailor", alternateName: ["S.T Tailor HCMC", "S.T Tailor Ho Chi Minh City"], inLanguage: ["en", "vi"], publisher: { "@id": "https://sttailor.com/#business" } },
    { "@type": pageType, "@id": `${canonical}#webpage`, url: canonical, name: title, description, isPartOf: { "@id": "https://sttailor.com/#website" }, about: { "@id": "https://sttailor.com/#business" }, mainEntity: { "@id": "https://sttailor.com/#business" }, primaryImageOfPage: { "@type": "ImageObject", url: `https://sttailor.com${shareImage}`, caption: shareImageAlt }, inLanguage: ["en", "vi"] },
    { "@type": "SiteNavigationElement", "@id": "https://sttailor.com/#navigation", name: routes.map(([, , routeTitle]) => routeTitle.split(" | ")[0]), url: routes.map(([routePath]) => `https://sttailor.com${routePath}`) }
  ];
  if (route === "/dich-vu/") graph.push({ "@type": "Service", "@id": `${canonical}#service`, name: "Bespoke tailoring and clothing alterations", alternateName: "May đo và sửa chữa trang phục", provider: { "@id": "https://sttailor.com/#business" }, areaServed: { "@type": "City", name: "Ho Chi Minh City" }, serviceType: ["Bespoke tailoring", "Formalwear", "Womenswear", "Clothing alterations"] });
  if (route !== "/") graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://sttailor.com/" }, { "@type": "ListItem", position: 2, name: title.split(" | ")[0], item: canonical }] });
  const jsonLd = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
  const safeTitle = title.replaceAll('"', "&quot;");
  const safeDescription = description.replaceAll('"', "&quot;");
  const safeImageAlt = shareImageAlt.replaceAll('"', "&quot;");
  const shareImageUrl = `https://sttailor.com${shareImage}`;
  const imageType = /\.webp$/i.test(shareImage) ? "image/webp" : "image/jpeg";
  const heroPreload = route === "/" ? `<link rel="preload" as="image" href="${shareImage}" fetchpriority="high">` : "";
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${safeDescription}"><meta name="author" content="S.T Tailor"><meta name="application-name" content="S.T Tailor"><meta name="color-scheme" content="light"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="google-site-verification" content="e1RyHPdDirO6wJIxuZKKSIY6EXYb37XMfktIVl3aJz8"><meta name="p:domain_verify" content="78c108c3384a3aa9201fb90b99f0b225"><link rel="canonical" href="${canonical}"><link rel="icon" href="/media/2026/09/logo-sttailor.png" type="image/png"><link rel="apple-touch-icon" href="/media/2026/09/logo-sttailor.png"><link rel="manifest" href="/site.webmanifest">${heroPreload}<meta property="og:title" content="${safeTitle}"><meta property="og:description" content="${safeDescription}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="S.T Tailor"><meta property="og:locale" content="vi_VN"><meta property="og:locale:alternate" content="en_US"><meta property="og:image" content="${shareImageUrl}"><meta property="og:image:type" content="${imageType}"><meta property="og:image:alt" content="${safeImageAlt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${safeTitle}"><meta name="twitter:description" content="${safeDescription}"><meta name="twitter:image" content="${shareImageUrl}"><meta name="twitter:image:alt" content="${safeImageAlt}"><meta name="theme-color" content="#ead1ad"><title>${safeTitle}</title>${jsonLd}<link rel="stylesheet" href="${stylesheetHref}"></head><body><div class="st-site-frame">${header(route)}<main id="main-content">${body}</main>${footer()}</div><script type="module" src="${scriptHref}"></script></body></html>`;
}

function collectAssetPaths() {
  const sourceFiles = [...routes.map(([, file]) => file), "Error.html", "Footer.html"];
  const content = [...sourceFiles.map((file) => readFileSync(path.join(sourceRoot, file), "utf8")), readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8")].join("\n");
  const matcher = /https?:\/\/sttailor\.com\/wp-content\/uploads\/([^\"' )]+)/g;
  const localFonts = ["fonts/cormorant-garamond-regular.woff2", "fonts/cormorant-garamond-semibold.woff2", "fonts/manrope-regular.woff2", "fonts/manrope-semibold.woff2"].filter((asset) => existsSync(path.join(sourceMedia, asset)));
  const found = new Set(["2026/09/logo-sttailor.png", "2026/09/logo-sttailor-1000x1024.png", ...localFonts]);
  for (const match of content.matchAll(matcher)) found.add(match[1]);
  return [...found].filter((asset) => !asset.includes(".."));
}

function copyAssets() {
  if (!existsSync(sourceMedia)) throw new Error(`Versioned media source not found: ${sourceMedia}`);
  const assets = collectAssetPaths();
  const missing = assets.filter((asset) => !existsSync(path.join(sourceMedia, asset)));
  if (missing.length) throw new Error(`Versioned media source is incomplete:\n${missing.join("\n")}`);
  cpSync(sourceMedia, path.join(dist, "media"), { recursive: true });
  return assets;
}

function assertGalleryHasNoDuplicates() {
  const gallery = transformGallery(readSource("Gallery.html"));
  const refs = [...gallery.matchAll(/https?:\/\/sttailor\.com\/wp-content\/uploads\/([^\"' )]+)/g)].map((match) => match[1]);
  if (new Set(refs).size !== refs.length) throw new Error("Gallery source contains duplicate image references. Build stopped to preserve the no-duplicate gallery rule.");
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
assertGalleryHasNoDuplicates();
const assets = copyAssets();
mkdirSync(path.join(dist, "styles"), { recursive: true });
mkdirSync(path.join(dist, "scripts"), { recursive: true });

const wordpressCss = readFileSync(path.join(sourceRoot, "CustomCSS.css"), "utf8").replaceAll("https://sttailor.com/wp-content/uploads/", "/media/");
const standaloneCss = readFileSync(path.join(root, "src", "styles", "standalone-shell.css"), "utf8");
const fullCustomCss = `${wordpressCss}\n\n/* Cloudflare Worker standalone shell. WordPress page CSS above remains the visual source of truth. */\n${standaloneCss}\n`;
stylesheetHref = `/styles/site.css?v=${createHash("sha256").update(fullCustomCss).digest("hex").slice(0, 12)}`;
writeFileSync(path.join(dist, "styles", "site.css"), fullCustomCss, "utf8");
writeFileSync(path.join(root, "CustomCSS-Full.css"), fullCustomCss, "utf8");
const siteScript = readFileSync(path.join(root, "src", "scripts", "site.js"), "utf8");
scriptHref = `/scripts/site.js?v=${createHash("sha256").update(siteScript).digest("hex").slice(0, 12)}`;
writeFileSync(path.join(dist, "scripts", "site.js"), siteScript, "utf8");

for (const [route, sourceFile, title, description, shareImage, shareImageAlt] of routes) {
  const output = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, documentFor(route, sourceFile, title, description, shareImage, shareImageAlt), "utf8");
}
const notFoundDocument = documentFor("/", "Error.html", "Page not found | S.T Tailor", "The requested S.T Tailor page was not found.", "/media/2026/06/store-sttailor-1.webp", "S.T Tailor showroom in Ho Chi Minh City");
writeFileSync(path.join(dist, "404.html"), notFoundDocument, "utf8");
writeFileSync(path.join(dist, "not-found.html"), notFoundDocument, "utf8");
writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /build-manifest.json\nSitemap: https://sttailor.com/sitemap.xml\n", "utf8");
const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const buildDate = new Date().toISOString().slice(0, 10);
const sitemapEntries = routes.map(([route, , , , shareImage, shareImageAlt]) => {
  const pagePath = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  const pageHtml = readFileSync(pagePath, "utf8");
  const imageMap = new Map([[shareImage, shareImageAlt]]);
  for (const match of pageHtml.matchAll(/<img\b[^>]*\bsrc="(\/media\/[^"]+)"[^>]*>/gi)) {
    const alt = /\balt="([^"]*)"/i.exec(match[0])?.[1] || "S.T Tailor";
    if (!imageMap.has(match[1])) imageMap.set(match[1], alt);
  }
  const imageEntries = [...imageMap].slice(0, 20).map(([src, alt]) => `<image:image><image:loc>https://sttailor.com${xmlEscape(src)}</image:loc><image:title>${xmlEscape(alt)}</image:title></image:image>`).join("");
  return `\n  <url><loc>https://sttailor.com${route}</loc><lastmod>${buildDate}</lastmod>${imageEntries}</url>`;
}).join("");
writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${sitemapEntries}\n</urlset>\n`, "utf8");
writeFileSync(path.join(dist, "site.webmanifest"), JSON.stringify({ name: "S.T Tailor", short_name: "S.T Tailor", description: "Bespoke tailoring and clothing alterations in Ho Chi Minh City.", start_url: "/", scope: "/", display: "standalone", background_color: "#f3e1c5", theme_color: "#ead1ad", icons: [{ src: "/media/2026/09/logo-sttailor.png", sizes: "any", type: "image/png", purpose: "any maskable" }] }, null, 2), "utf8");
writeFileSync(path.join(dist, "llms.txt"), "# S.T Tailor\n\nS.T Tailor is a bespoke tailoring and clothing alterations house at 258 Le Thanh Ton, Phuong Tan Dinh, Ho Chi Minh City, Vietnam.\n\n- Website: https://sttailor.com/\n- Services: https://sttailor.com/dich-vu/\n- Gallery: https://sttailor.com/gallery/\n- Pricing: https://sttailor.com/bang-gia/\n- Payment methods: https://sttailor.com/phuong-thuc-thanh-toan/\n- Contact: https://sttailor.com/lien-he/\n- Telephone: +84 909 556 258\n- Email: contact.sttailor@gmail.com\n", "utf8");
writeFileSync(path.join(dist, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n  Strict-Transport-Security: max-age=31536000\n  Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests\n", "utf8");
writeFileSync(path.join(dist, "build-manifest.json"), JSON.stringify({ source: "source/wordpress", sourceMedia: "source/media", routes: routes.map(([route]) => route), localUploadAssets: assets.length, galleryDuplicateCheck: "passed" }, null, 2), "utf8");
console.log(`Built ${routes.length} routes from the versioned WordPress reference with ${assets.length} local upload assets.`);
