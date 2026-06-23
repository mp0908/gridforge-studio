document.documentElement.classList.add("js");

const navToggle = document.querySelector("[data-nav-toggle]");
const header = document.querySelector("[data-header]");
const faqButtons = document.querySelectorAll("[data-faq-button]");
const contactForm = document.querySelector("[data-contact-form]");

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

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const label = submitButton?.querySelector("span");

  if (!submitButton) return;

  if (label) {
    label.textContent = "Upit je spreman za slanje";
  } else {
    submitButton.textContent = "Upit je spreman za slanje";
  }
  submitButton.disabled = true;
});

/* ---------------------------------------------------------------
   Drip cursor — a small "polish drop" that follows the pointer,
   shifting shape near links to feel like it's about to touch down.
--------------------------------------------------------------- */
const cursor = document.querySelector("[data-cursor]");

if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let renderedX = cursorX;
  let renderedY = cursorY;
  let hasMoved = false;

  window.addEventListener(
    "mousemove",
    (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      if (!hasMoved) {
        hasMoved = true;
        cursor.classList.add("is-active");
      }
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  document.addEventListener("mouseenter", () => {
    if (hasMoved) cursor.classList.add("is-active");
  });

  const interactiveSelector = "a, button, [data-faq-button], input, select, textarea, label";

  document.addEventListener("mouseover", (event) => {
    if (event.target.closest(interactiveSelector)) {
      cursor.classList.add("is-link");
    }
  });

  document.addEventListener("mouseout", (event) => {
    if (event.target.closest(interactiveSelector)) {
      cursor.classList.remove("is-link");
    }
  });

  const renderCursor = () => {
    renderedX += (cursorX - renderedX) * 0.18;
    renderedY += (cursorY - renderedY) * 0.18;
    cursor.style.transform = `translate(${renderedX}px, ${renderedY}px) translate(-50%, -100%) rotate(-45deg) scale(${
      cursor.classList.contains("is-link") ? 0.85 : 0.6
    })`;
    requestAnimationFrame(renderCursor);
  };

  requestAnimationFrame(renderCursor);
} else if (cursor) {
  cursor.remove();
}