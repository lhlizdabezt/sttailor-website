const badge = document.querySelector("#TA_rated383");
const widget = document.querySelector(".st-tripadvisor__widget");
const fallback = widget.querySelector(".st-tripadvisor__fallback");
const listing = fallback.href;

function shareBadgeStatus() {
  if (window.parent === window) return;
  const status = widget.hasAttribute("data-ready") ? "st-tailor-tripadvisor-ready" : "st-tailor-tripadvisor-unavailable";
  window.parent.postMessage(status, location.origin);
}

window.addEventListener("message", (event) => {
  if (event.source === window.parent && event.origin === location.origin && event.data === "st-tailor-tripadvisor-status") shareBadgeStatus();
});

// The vendor can populate its anchor attributes in separate asynchronous steps.
function updateWidget() {
  for (const link of badge.querySelectorAll("a")) {
    const href = link.getAttribute("href")?.trim();
    const isBadgeLink = link.classList.contains("widFRRClickWrap");
    if (!href || href.startsWith("#") || /^javascript:/i.test(href) || isBadgeLink) {
      if (link.href !== listing) link.href = listing;
      if (link.target !== "_blank") link.target = "_blank";
      if (link.rel !== "nofollow noopener noreferrer") link.rel = "nofollow noopener noreferrer";
      if (isBadgeLink) {
        link.setAttribute("aria-label", "View S.T Tailor on Tripadvisor / Xem S.T Tailor trên Tripadvisor");
        link.setAttribute("aria-describedby", "st-tripadvisor-new-tab");
      }
    }
    if (href === "https://www.tripadvisor.com/" && !link.textContent.trim() && !link.hasAttribute("aria-label")) {
      link.setAttribute("aria-label", "Tripadvisor homepage / Trang chủ Tripadvisor");
    }
  }
  // Keep the independent link available until the badge can take over without moving focus.
  const logo = badge.querySelector("#CDSWIDFRR img");
  const action = badge.querySelector(".widFRRClickWrap[href]");
  const ready = Boolean(logo?.complete && logo.naturalWidth && action?.href === listing);
  const focused = document.activeElement;
  if ((ready && focused === fallback) || (!ready && badge.contains(focused))) return;
  if (widget.hasAttribute("data-ready") === ready) return;
  widget.toggleAttribute("data-ready", ready);
  shareBadgeStatus();
}

widget.addEventListener("focusout", () => requestAnimationFrame(updateWidget));
badge.addEventListener("load", updateWidget, true);
badge.addEventListener("error", updateWidget, true);
new MutationObserver(updateWidget).observe(badge, {
  childList: true,
  subtree: true,
  attributeFilter: ["href", "target", "rel", "class", "src"],
});
updateWidget();
