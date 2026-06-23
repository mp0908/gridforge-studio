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

(function () {
  'use strict';

  var IFRAME_WIDTH = 1280;

  function scaleIframes() {
    var viewports = document.querySelectorAll('.iframe-viewport');
    viewports.forEach(function (vp) {
      var containerWidth = vp.offsetWidth;
      if (!containerWidth) return;
      var scale = containerWidth / IFRAME_WIDTH;
      var iframe = vp.querySelector('iframe');
      if (!iframe) return;
      iframe.style.transform = 'scale(' + scale + ')';
      /* Adjust the viewport height so it shows a proportional slice */
      var iframeNativeHeight = parseInt(iframe.style.height || iframe.getAttribute('height') || 900, 10);
      vp.style.height = Math.round(iframeNativeHeight * scale) + 'px';
    });
  }

  /* Run on load */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scaleIframes);
  } else {
    scaleIframes();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(scaleIframes, 120);
  });

  /* Re-run after each iframe loads so height is correct */
  document.querySelectorAll('.iframe-viewport iframe').forEach(function (iframe) {
    iframe.addEventListener('load', scaleIframes);
  });
})();

/* =============================================================
   contact-anim.js
   Dodati u main.js ili uključiti kao poseban fajl:
     <script src="js/contact-anim.js"></script>
   ============================================================= */

(function () {
  'use strict';

  /* ── helpers ── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  /* ── 1. Typewriter heading ── */
  function initTypedHeading() {
    var el = qs('[data-typed-heading]');
    if (!el) return;

    var phrases = [
      'treba čvrstu web osnovu?',
      'želi više online poziva?',
      'raste i treba novi sajt?',
      'tek kreće sa online prisustvom?'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var pauseMs = 2200;
    var typeMs = 48;
    var deleteMs = 24;

    function tick() {
      var phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(tick, pauseMs);
          return;
        }
      } else {
        charIndex--;
        el.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 320);
          return;
        }
      }
      setTimeout(tick, deleting ? deleteMs : typeMs);
    }

    /* Start after a short delay so the section is in view */
    setTimeout(tick, 600);
  }

  /* ── 2. Stagger form fields when section enters viewport ── */
  function initFieldReveal() {
    var fields = qsa('[data-ct-field]');
    if (!fields.length) return;

    var section = qs('.contact-section');
    if (!section) return;

    var revealed = false;

    function revealFields() {
      if (revealed) return;
      var rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.82) {
        revealed = true;
        fields.forEach(function (field, i) {
          setTimeout(function () {
            field.classList.add('is-visible');
          }, 120 + i * 110);
        });
      }
    }

    window.addEventListener('scroll', revealFields, { passive: true });
    revealFields();
  }

  /* ── 3. Typewriter intro line ── */
  function initTerminalIntro() {
    var el = qs('[data-ct-type]');
    if (!el) return;
    var text = el.getAttribute('data-ct-type');
    var i = 0;

    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(type, 38);
      }
    }

    var section = qs('.contact-section');
    if (!section) { type(); return; }

    var started = false;
    function check() {
      if (started) return;
      var r = section.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) {
        started = true;
        setTimeout(type, 300);
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ── 4. Chip selector ── */
  function initChips() {
    qsa('.ct-chips').forEach(function (group) {
      var hidden = qs('[data-chip-value]', group.closest('.ct-field'));
      qsa('[data-chip]', group).forEach(function (chip) {
        chip.addEventListener('click', function () {
          qsa('[data-chip]', group).forEach(function (c) {
            c.classList.remove('is-active');
          });
          chip.classList.add('is-active');
          if (hidden) hidden.value = chip.textContent.trim();
        });
      });
    });
  }

  /* ── 5. Form submit → open mail client ── */
  function initForm() {
    var form = qs('[data-ct-form]');
    var success = qs('[data-ct-success]');
    var statusEl = qs('[data-ct-status]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ime    = (form.elements['ime']    && form.elements['ime'].value.trim())    || '';
      var email  = (form.elements['email']  && form.elements['email'].value.trim())  || '';
      var tip    = (form.elements['tip']    && form.elements['tip'].value.trim())    || '';
      var poruka = (form.elements['poruka'] && form.elements['poruka'].value.trim()) || '';

      var body = [
        'Ime: ' + ime,
        'Email: ' + email,
        'Tip projekta: ' + tip,
        '',
        poruka
      ].join('\n');

      var mailto =
        'mailto:milospetrovic9034@gmail.com' +
        '?subject=' + encodeURIComponent('Upit za projekat — ' + (tip || 'Opšte')) +
        '&body='    + encodeURIComponent(body);

      window.location.href = mailto;

      if (statusEl) { statusEl.textContent = 'sent ✓'; }
      if (success)  {
        form.style.opacity = '0';
        form.style.pointerEvents = 'none';
        setTimeout(function () {
          form.style.display = 'none';
          success.classList.add('is-visible');
        }, 300);
      }
    });
  }

  /* ── init ── */
  function init() {
    initTypedHeading();
    initTerminalIntro();
    initFieldReveal();
    initChips();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();