document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const scrollLinks = document.querySelectorAll('a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");

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

const updateHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
nav?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
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
      rootMargin: "0px 0px -80px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// HERO TEXT ROTATOR
const rotators = document.querySelectorAll("[data-rotator]");

rotators.forEach((rotator) => {
  const words = rotator.querySelectorAll(".rotator-word");
  let index = 0;

  setInterval(() => {
    words[index].classList.remove("is-active");
    index = (index + 1) % words.length;
    words[index].classList.add("is-active");
  }, 1600);
});

// HERO TERMINAL TYPING (LOOP)
const terminal = document.querySelector("[data-terminal]");
if (terminal) {
  const typeLines = [
    "npm run build",
    "git push origin main",
    "deploy --prod",
  ];

  const outLines = [
    "✔ build successful",
    "✔ pushed to GitHub",
    "✔ live at gridforge.studio",
  ];

  const typeEls = terminal.querySelectorAll("[data-type-line]");
  const outEls = terminal.querySelectorAll("[data-out-line]");

  let line = 0;
  let char = 0;

  const typeSpeed = 45;
  const lineDelay = 700;
  const loopDelay = 1800;

  function resetTerminal() {
    typeEls.forEach((el) => (el.textContent = ""));
    outEls.forEach((el) => (el.textContent = ""));
    line = 0;
    char = 0;
  }

  function type() {
    if (line >= typeLines.length) {
      setTimeout(() => {
        resetTerminal();
        type();
      }, loopDelay);
      return;
    }

    const current = typeLines[line];
    const el = typeEls[line];

    if (char < current.length) {
      el.textContent += current.charAt(char);
      char++;
      setTimeout(type, typeSpeed);
    } else {
      setTimeout(() => {
        if (outEls[line]) {
          outEls[line].textContent = outLines[line];
        }
        line++;
        char = 0;
        setTimeout(type, lineDelay);
      }, 300);
    }
  }

  setTimeout(type, 600);
}