const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");

if (toggle && nav) {
  const links = [...nav.querySelectorAll("a")];
  const mobile = () => window.matchMedia("(max-width: 980px)").matches;
  const editable = (target) => target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  const isOpen = () => nav.classList.contains("is-open");

  const setOpen = (open, returnFocus = false) => {
    nav.classList.toggle("is-open", open);
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

  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key.toLowerCase() === "m" && mobile() && !editable(event.target)) {
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

  window.addEventListener("resize", () => {
    if (!mobile() && isOpen()) setOpen(false);
  }, { passive: true });
}

const revealables = document.querySelectorAll(".st-motion, .st-home-v6__rise");
// The editorial pages already have entrance motion. Give only their static,
// below-the-fold sections the same quiet rise, without delaying first paint.
// Elements remain visible if JavaScript, IntersectionObserver, or motion is off.
const canReveal = "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const viewportBottom = window.innerHeight + 24;
const scrollTargets = canReveal
  ? [...document.querySelectorAll("main section, main article")]
      .filter((element) => !element.matches(".st-motion, .stpr-card, .stp-card, .st-contact-card") && !element.querySelector(".st-motion"))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.height > 48 && rect.top >= viewportBottom)
      .map(({ element }) => element)
  : [];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealables.forEach((element) => observer.observe(element));
  scrollTargets.forEach((element) => {
    element.classList.add("st-scroll-reveal");
    observer.observe(element);
  });
} else {
  revealables.forEach((element) => element.classList.add("is-visible"));
}

// Keyboard users can jump straight to a link inside a section before the
// observer callback fires; reveal that section as soon as it receives focus.
document.addEventListener("focusin", (event) => {
  if (event.target instanceof Element) event.target.closest(".st-scroll-reveal")?.classList.add("is-visible");
});

// Measurement is deliberately limited to public interaction context. Never send
// visitor-entered content, email addresses, telephone numbers, or form fields.
const pageTypes = {
  "/": "home",
  "/gioi-thieu/": "about",
  "/dich-vu/": "services",
  "/gallery/": "gallery",
  "/bang-gia/": "pricing",
  "/phuong-thuc-thanh-toan/": "payment",
  "/lien-he/": "contact",
  "/cam-nang-may-do/": "guide_hub",
  "/chon-vai-may-do/": "guide_cloth",
  "/quy-trinh-thu-do/": "guide_fitting",
  "/chinh-sua-trang-phuc/": "guide_alterations",
  "/bao-quan-giat-la/": "guide_care",
  "/doi-tra-hoan-tien/": "returns",
  "/chinh-sach-van-chuyen/": "shipping",
  "/dieu-khoan-dieu-kien/": "terms",
  "/chinh-sach-bao-mat/": "privacy"
};
const pageType = pageTypes[window.location.pathname] ?? "other";

const claritySet = (key, value) => {
  if (typeof window.clarity === "function") window.clarity("set", key, value);
};
const sendEvent = (name, parameters) => {
  if (typeof window.gtag === "function") window.gtag("event", name, parameters);
  if (typeof window.clarity === "function") window.clarity("event", name);
};
const linkPlacement = (link) => {
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  if (link.closest("main")) return "main";
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
