const badge = document.querySelector("#TA_rated383");
const listing = badge.querySelector(".st-tripadvisor__fallback").href;

// The vendor can populate its anchor attributes in separate asynchronous steps.
function repairWidgetLinks() {
  for (const link of badge.querySelectorAll('a:not([href]), a[href=""], a.widFRRClickWrap')) {
    if (link.href !== listing) link.href = listing;
    link.target = "_blank";
    link.rel = "nofollow noopener noreferrer";
    if (link.classList.contains("widFRRClickWrap")) link.setAttribute("aria-label", "View S.T Tailor on Tripadvisor");
  }
}

repairWidgetLinks();
new MutationObserver(repairWidgetLinks).observe(badge, {
  childList: true,
  subtree: true,
  attributeFilter: ["href", "class"],
});
