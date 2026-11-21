const badge = document.querySelector("#TA_rated383");
const listing = badge.querySelector(".st-tripadvisor__fallback").href;

// The vendor can populate its anchor attributes in separate asynchronous steps.
function repairWidgetLinks() {
  for (const link of badge.querySelectorAll("a")) {
    const href = link.getAttribute("href")?.trim();
    const isBadgeLink = link.classList.contains("widFRRClickWrap");
    if (!href || href.startsWith("#") || /^javascript:/i.test(href) || isBadgeLink) {
      if (link.href !== listing) link.href = listing;
      link.target = "_blank";
      link.rel = "nofollow noopener noreferrer";
      if (isBadgeLink) {
        link.setAttribute("aria-label", "View S.T Tailor on Tripadvisor / Xem S.T Tailor trên Tripadvisor");
      }
    }
    if (href === "https://www.tripadvisor.com/" && !link.textContent.trim() && !link.hasAttribute("aria-label")) {
      link.setAttribute("aria-label", "Tripadvisor homepage / Trang chủ Tripadvisor");
    }
  }
}

repairWidgetLinks();
new MutationObserver(repairWidgetLinks).observe(badge, {
  childList: true,
  subtree: true,
  attributeFilter: ["href", "class"],
});
