document.documentElement.classList.add("js");

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-scroll-progress]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  if (progress) {
    progress.style.width = `${Math.min(progressValue, 100)}%`;
  }

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

const revealItems = Array.from(document.querySelectorAll([
  ".section-heading",
  ".intro-strip > div",
  ".about-grid > p",
  ".feature-panel",
  ".mini-panel",
  ".interests span",
  ".project-card",
  ".timeline-item",
  ".credential-card",
  ".skill-group",
  ".cert-list span",
  ".contact-panel"
].join(",")));

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 45}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const hoverPanels = document.querySelectorAll([
  ".feature-panel",
  ".mini-panel",
  ".project-card",
  ".credential-card",
  ".skill-group",
  ".contact-panel"
].join(","));

hoverPanels.forEach((panel) => {
  panel.addEventListener("pointermove", (event) => {
    const bounds = panel.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    panel.style.setProperty("--mx", `${x}%`);
    panel.style.setProperty("--my", `${y}%`);
  });
});

const sections = Array.from(document.querySelectorAll("section[id]"));

if ("IntersectionObserver" in window && sections.length > 0 && navLinks.length > 0) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
      navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
    });
  }, { threshold: 0.2, rootMargin: "-30% 0px -55% 0px" });

  sections.forEach((section) => navObserver.observe(section));
}
