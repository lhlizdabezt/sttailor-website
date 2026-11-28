const reviewSnippets = document.querySelector("#TA_selfserveprop383");
const widget = document.querySelector(".st-tripadvisor__widget");
const fallback = widget.querySelector(".st-tripadvisor__fallback");
const listing = fallback.href;
const listingOrigin = new URL(listing).origin;
let previousReady;
let previousHeight;

function shareReviewStatus(force = false) {
  if (window.parent === window) return;
  const ready = widget.hasAttribute("data-ready");
  let height = null;
  if (ready) {
    const style = getComputedStyle(widget);
    const snippetHeight = Math.max(reviewSnippets.scrollHeight, reviewSnippets.getBoundingClientRect().height);
    height = Math.ceil(snippetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
  }
  if (!force && ready === previousReady && height === previousHeight) return;
  previousReady = ready;
  previousHeight = height;
  window.parent.postMessage({ type: "st-tailor-tripadvisor-status", ready, height }, location.origin);
}

window.addEventListener("message", (event) => {
  if (event.source === window.parent && event.origin === location.origin && event.data === "st-tailor-tripadvisor-status") shareReviewStatus(true);
});

// The vendor can populate its anchor attributes in separate asynchronous steps.
function updateWidget() {
  for (const link of reviewSnippets.querySelectorAll("a")) {
    // Keep only official links and use direct navigation within the sandbox.
    if (link.origin !== listingOrigin || link.username || link.password) link.href = listing;
    if (link.hasAttribute("onclick")) link.removeAttribute("onclick");
    if (link.target !== "_blank") link.target = "_blank";
    if (link.rel !== "nofollow noopener noreferrer") link.rel = "nofollow noopener noreferrer";
    if (link.getAttribute("aria-describedby") !== "st-tripadvisor-new-tab") {
      link.setAttribute("aria-describedby", "st-tripadvisor-new-tab");
    }
    if (link.href === `${listingOrigin}/` && !link.textContent.trim() && !link.hasAttribute("aria-label")) {
      link.setAttribute("aria-label", "Tripadvisor homepage / Trang chủ Tripadvisor");
    }
  }
  const logo = reviewSnippets.querySelector("#CDSWIDSSP img");
  const action = reviewSnippets.querySelector("#allreviews[href]");
  const review = reviewSnippets.querySelector(".widSSPQuote");
  const ready = Boolean(logo?.complete && logo.naturalWidth && action?.origin === listingOrigin && review?.textContent.trim());
  const focused = document.activeElement;
  if ((ready && focused === fallback) || (!ready && reviewSnippets.contains(focused))) return;
  widget.toggleAttribute("data-ready", ready);
  // The vendor's fixed wrapper can gain scroll height without changing its box size.
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
// New review excerpts or reflow at a narrower width can change the preview size.
new ResizeObserver(() => shareReviewStatus()).observe(reviewSnippets);
window.addEventListener("resize", () => shareReviewStatus());
updateWidget();
