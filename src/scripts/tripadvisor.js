const reviewSnippets = document.querySelector("#TA_selfserveprop383");
const widget = document.querySelector(".st-tripadvisor__widget");
const fallback = widget.querySelector(".st-tripadvisor__fallback");
const listing = fallback.href;

function shareReviewStatus() {
  if (window.parent === window) return;
  const status = widget.hasAttribute("data-ready") ? "st-tailor-tripadvisor-ready" : "st-tailor-tripadvisor-unavailable";
  window.parent.postMessage(status, location.origin);
}

window.addEventListener("message", (event) => {
  if (event.source === window.parent && event.origin === location.origin && event.data === "st-tailor-tripadvisor-status") shareReviewStatus();
});

// The vendor can populate its anchor attributes in separate asynchronous steps.
function updateWidget() {
  for (const link of reviewSnippets.querySelectorAll("a")) {
    const href = link.getAttribute("href")?.trim();
    const isCoverLink = link.classList.contains("widSSPClickWrap");
    if (!href || href.startsWith("#") || /^javascript:/i.test(href) || isCoverLink) {
      if (link.href !== listing) link.href = listing;
    }
    if (link.href === listing) {
      if (link.target !== "_blank") link.target = "_blank";
      if (link.rel !== "nofollow noopener noreferrer") link.rel = "nofollow noopener noreferrer";
      link.setAttribute("aria-describedby", "st-tripadvisor-new-tab");
      if (isCoverLink) {
        link.setAttribute("aria-label", "View S.T Tailor on Tripadvisor / Xem S.T Tailor trên Tripadvisor");
      }
    }
    if (href === "https://www.tripadvisor.com/" && !link.textContent.trim() && !link.hasAttribute("aria-label")) {
      link.setAttribute("aria-label", "Tripadvisor homepage / Trang chủ Tripadvisor");
    }
  }
  const logo = reviewSnippets.querySelector("#CDSWIDSSP img");
  const action = reviewSnippets.querySelector(".widSSPClickWrap[href]");
  const review = reviewSnippets.querySelector(".widSSPQuote");
  const ready = Boolean(logo?.complete && logo.naturalWidth && action?.href === listing && review?.textContent.trim());
  const focused = document.activeElement;
  if ((ready && focused === fallback) || (!ready && reviewSnippets.contains(focused))) return;
  if (widget.hasAttribute("data-ready") === ready) return;
  widget.toggleAttribute("data-ready", ready);
  shareReviewStatus();
}

widget.addEventListener("focusout", () => requestAnimationFrame(updateWidget));
reviewSnippets.addEventListener("load", updateWidget, true);
reviewSnippets.addEventListener("error", updateWidget, true);
new MutationObserver(updateWidget).observe(reviewSnippets, {
  childList: true,
  subtree: true,
  attributeFilter: ["href", "target", "rel", "class", "src"],
});
updateWidget();
