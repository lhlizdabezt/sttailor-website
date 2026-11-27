const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");
const tripadvisorBadge = document.querySelector(".st-tripadvisor__badge");

if (tripadvisorBadge) {
  const badgeFrame = tripadvisorBadge.querySelector("iframe");
  window.addEventListener("message", (event) => {
    if (event.source !== badgeFrame.contentWindow || event.origin !== "null") return;
    if (event.data === "st-tailor-tripadvisor-ready") tripadvisorBadge.setAttribute("data-badge-ready", "");
    if (event.data === "st-tailor-tripadvisor-unavailable") tripadvisorBadge.removeAttribute("data-badge-ready");
  });
  // The vendor can render before this module or before the frame's load event.
  // The query carries no data and must target the frame's opaque sandbox origin.
  const requestBadgeStatus = () => badgeFrame.contentWindow?.postMessage("st-tailor-tripadvisor-status", "*");
  badgeFrame.addEventListener("load", requestBadgeStatus);
  requestBadgeStatus();
}

if (toggle && nav) {
  const links = [...nav.querySelectorAll("a")];
  const mobile = window.matchMedia("(max-width: 980px)");
  const editable = (target) => target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  const isOpen = () => nav.classList.contains("is-open");

  const setOpen = (open, returnFocus = false) => {
    nav.classList.toggle("is-open", open);
    nav.inert = mobile.matches && !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("nav-is-open", open);
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(!isOpen()));
  links.forEach((link) => link.addEventListener("click", () => setOpen(false)));

  document.addEventListener("click", (event) => {
    if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });

  document.addEventListener("focusin", (event) => {
    if (mobile.matches && isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key.toLowerCase() === "m" && mobile.matches && !editable(event.target)) {
      event.preventDefault();
      const opening = !isOpen();
      setOpen(opening);
      if (opening) links[0]?.focus();
      return;
    }
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      setOpen(false, true);
      return;
    }
    if (!isOpen() || !links.includes(document.activeElement)) return;
    const current = links.indexOf(document.activeElement);
    let next = current;
    if (event.key === "ArrowDown") next = (current + 1) % links.length;
    else if (event.key === "ArrowUp") next = (current - 1 + links.length) % links.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = links.length - 1;
    else return;
    event.preventDefault();
    links[next]?.focus();
  });

  mobile.addEventListener("change", () => setOpen(false));
  setOpen(false);
}

// Measurement is deliberately limited to public interaction context. Never send
// visitor-entered content, email addresses, telephone numbers, or form fields.
const pageTypes = {
  "/": "home",
  "/gioi-thieu/": "about",
  "/dich-vu/": "services",
  "/dich-vu/suit-may-do/": "service_suits",
  "/dich-vu/le-phuc-cuoi/": "service_wedding",
  "/dich-vu/trang-phuc-nu/": "service_womenswear",
  "/dich-vu/so-mi-may-do/": "service_shirts",
  "/dich-vu/quan-tay-may-do/": "service_trousers",
  "/dich-vu/ao-khoac-may-do/": "service_jackets",
  "/gallery/": "gallery",
  "/phim-thu-do/": "fitting_film",
  "/bang-gia/": "pricing",
  "/phuong-thuc-thanh-toan/": "payment",
  "/lien-he/": "contact",
  "/cam-nang-may-do/": "guide_hub",
  "/cam-nang-may-do/buoi-tu-van-dau-tien/": "guide_first_consultation",
  "/cam-nang-may-do/nhan-trang-phuc-may-do/": "guide_garment_collection",
  "/cam-nang-may-do/thu-do-khi-du-lich/": "guide_travel_fittings",
  "/cam-nang-may-do/kiem-tra-phom-suit/": "guide_suit_fit",
  "/cam-nang-may-do/chon-lot-ao-khoac/": "guide_jacket_lining",
  "/cam-nang-may-do/chon-suit-hai-manh-ba-manh/": "guide_suit_pieces",
  "/cam-nang-may-do/chuan-bi-trang-phuc-cuoi/": "guide_wedding_planning",
  "/chon-vai-may-do/": "guide_cloth",
  "/chon-vai-may-do/vai-len-y/": "guide_italian_wool",
  "/chon-vai-may-do/lua-viet-nam/": "guide_vietnamese_silk",
  "/quy-trinh-thu-do/": "guide_fitting",
  "/chinh-sua-trang-phuc/": "guide_alterations",
  "/bao-quan-giat-la/": "guide_care",
  "/cham-soc-khach-hang/": "client_care",
  "/cham-soc-khach-hang/sua-chua-sau-khi-nhan-do/": "client_aftercare",
  "/san-pham/": "showcase_garments",
  "/du-an/": "showcase_projects",
  "/doi-tra-hoan-tien/": "returns",
  "/chinh-sach-van-chuyen/": "shipping",
  "/dieu-khoan-dieu-kien/": "terms",
  "/chinh-sach-bao-mat/": "privacy"
};
const pathname = window.location.pathname;
const pageType = pageTypes[pathname] ?? (
  pathname.startsWith("/san-pham/") ? "showcase_garment" :
  pathname.startsWith("/du-an/") ? "showcase_project" : "other"
);

const claritySet = (key, value) => {
  if (typeof window.clarity === "function") window.clarity("set", key, value);
};
const sendEvent = (name, parameters) => {
  if (typeof window.gtag === "function") window.gtag("event", name, parameters);
  if (typeof window.clarity === "function") window.clarity("event", name);
};
const linkPlacement = (link) => {
  if (link.closest("main")) return "main";
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  return "other";
};
const directContactMethod = (href) => {
  const normalized = href.toLowerCase();
  if (normalized.startsWith("tel:")) return "telephone";
  if (normalized.startsWith("mailto:")) return "email";
  if (normalized.includes("wa.me/")) return "whatsapp";
  if (normalized.includes("zalo.me/")) return "zalo";
  if (normalized.includes("m.me/")) return "messenger";
  if (normalized.includes("instagram.com/")) return "instagram";
  if (normalized.includes("maps.app.goo.gl/") || normalized.includes("google.com/maps")) return "maps";
  return null;
};

claritySet("page_type", pageType);
claritySet("site_locale", "vi_en");

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!link) return;

  const href = link.getAttribute("href") ?? "";
  const placement = linkPlacement(link);
  const contactMethod = directContactMethod(href);
  if (contactMethod) {
    sendEvent("contact_click", { contact_method: contactMethod, link_placement: placement, page_type: pageType });
    return;
  }

  const destination = new URL(href, window.location.href);
  if (destination.origin === window.location.origin && destination.pathname === "/lien-he/") {
    sendEvent("consultation_intent", { link_placement: placement, page_type: pageType });
  }
});
