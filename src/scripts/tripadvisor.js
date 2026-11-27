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
    if (!href || href.startsWith("#") || /^javascript:/i.test(href)) {
      if (link.href !== listing) link.href = listing;
    }
    // Use each official href directly inside the strict sandbox.
    if (link.hasAttribute("onclick")) link.removeAttribute("onclick");
    if (link.href === listing) {
      if (link.target !== "_blank") link.target = "_blank";
    }
    if (link.target === "_blank") {
      if (link.rel !== "nofollow noopener noreferrer") link.rel = "nofollow noopener noreferrer";
      link.setAttribute("aria-describedby", "st-tripadvisor-new-tab");
    }
    if (href === "https://www.tripadvisor.com/" && !link.textContent.trim() && !link.hasAttribute("aria-label")) {
      link.setAttribute("aria-label", "Tripadvisor homepage / Trang chủ Tripadvisor");
    }
  }
  const logo = reviewSnippets.querySelector("#CDSWIDSSP img");
  const action = reviewSnippets.querySelector("#allreviews[href]");
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
  attributeFilter: ["href", "target", "rel", "class", "src", "onclick"],
});
updateWidget();
