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
} else {
  revealables.forEach((element) => element.classList.add("is-visible"));
}
