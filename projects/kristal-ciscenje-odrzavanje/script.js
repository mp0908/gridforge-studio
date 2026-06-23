document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const scrollLinks = document.querySelectorAll('a[href^="#"]');
const scrollCueButtons = document.querySelectorAll("[data-scroll-target-fn]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");

const closeNavigation = () => {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

scrollLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    closeNavigation();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

scrollCueButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const next = document.getElementById("usluge");
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const updateHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

nav?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("nav-open")) {
    return;
  }

  const isClickInsideNav = nav?.contains(event.target);
  const isClickOnToggle = navToggle?.contains(event.target);

  if (!isClickInsideNav && !isClickOnToggle) {
    closeNavigation();
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -70px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const label = submitButton?.querySelector("span");

  if (!submitButton || !label) {
    return;
  }

  label.textContent = "Upit je spreman za slanje";
  submitButton.disabled = true;
});