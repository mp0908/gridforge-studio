document.documentElement.classList.add("js");

const navToggle = document.querySelector("[data-nav-toggle]");
const header = document.querySelector("[data-header]");
const faqButtons = document.querySelectorAll("[data-faq-button]");

const closeNav = () => {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    item?.classList.toggle("is-open", !isOpen);

    if (answer) {
      answer.style.maxHeight = isOpen ? "0px" : `${answer.scrollHeight}px`;
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -70px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
