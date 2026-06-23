'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     SMOOTH SCROLL + header hide-on-scroll
     ============================================================ */
  document.querySelectorAll('[data-scroll-target]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const header = document.querySelector('[data-header]');
  if (header) {
    let lastY = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      if (y > 120 && y > lastY) header.classList.add('is-hidden');
      else header.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  const burger = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (burger && mobileNav) {
    const close = () => {
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('sc-nav-open');
    };
    const open = () => {
      burger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('is-open');
      document.body.classList.add('sc-nav-open');
    };
    burger.addEventListener('click', () =>
      burger.getAttribute('aria-expanded') === 'true' ? close() : open()
    );
    mobileNav.querySelectorAll('[data-mobile-link]').forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => e.key === 'Escape' && close());
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  const cursorDot = document.querySelector('[data-cursor-dot]');
  const cursorLabel = document.querySelector('[data-cursor-label]');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursorDot && cursorLabel && canHover) {
    let mx = 0, my = 0, dx = 0, dy = 0;
    let hasMoved = false;
    window.addEventListener('mousemove', e => {
      if (!hasMoved) { hasMoved = true; cursorDot.style.opacity = '1'; }
      mx = e.clientX; my = e.clientY;
      cursorLabel.style.left = mx + 'px';
      cursorLabel.style.top = my + 'px';
    }, { passive: true });

    cursorDot.style.opacity = '0';
    cursorDot.style.transition = 'opacity 200ms, width 180ms var(--ease-out), height 180ms var(--ease-out), background 180ms';

    function rafDot() {
      dx += (mx - dx) * 0.18;
      dy += (my - dy) * 0.18;
      cursorDot.style.left = dx + 'px';
      cursorDot.style.top = dy + 'px';
      requestAnimationFrame(rafDot);
    }
    rafDot();

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorLabel.textContent = el.getAttribute('data-cursor');
        cursorLabel.classList.add('is-visible');
        cursorDot.style.width = '0px';
        cursorDot.style.height = '0px';
      });
      el.addEventListener('mouseleave', () => {
        cursorLabel.classList.remove('is-visible');
        cursorDot.style.width = '10px';
        cursorDot.style.height = '10px';
      });
    });

    // grow on draggable scan handle
    const scanFrameEl = document.querySelector('[data-scan-frame]');
    if (scanFrameEl) {
      scanFrameEl.addEventListener('mouseenter', () => {
        cursorLabel.textContent = '↔ Povuci';
        cursorLabel.classList.add('is-visible');
      });
      scanFrameEl.addEventListener('mouseleave', () => {
        cursorLabel.classList.remove('is-visible');
      });
    }
  }

  /* ============================================================
     STATEMENT STRIP — word-by-word lit on scroll
     ============================================================ */
  const statementH2 = document.querySelector('[data-scramble-text]');
  if (statementH2) {
    const original = statementH2.innerHTML;
    // wrap plain words in spans, leave the <span class="hl"> markup intact
    const wrapWords = (node) => {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(piece => {
            if (piece.trim() === '') {
              frag.appendChild(document.createTextNode(piece));
            } else {
              const span = document.createElement('span');
              span.className = 'word';
              span.textContent = piece;
              frag.appendChild(span);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapWords(child);
          child.classList.add('word');
        }
      });
    };
    wrapWords(statementH2);
    const words = statementH2.querySelectorAll('.word');

    const litObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ratio = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - entry.boundingClientRect.top) / (window.innerHeight * 0.5)));
        }
      });
    }, { threshold: 0 });

    const onScrollLight = () => {
      const rect = statementH2.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.25;
      const total = words.length;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const litCount = Math.round(progress * total);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < litCount));
    };
    window.addEventListener('scroll', onScrollLight, { passive: true });
    onScrollLight();
  }

  /* ============================================================
     SCAN SLIDER — drag to reveal cross-section
     ============================================================ */
  const scanFrame = document.querySelector('[data-scan-frame]');
  const scanLegendItems = document.querySelectorAll('[data-legend]');
  const scanTags = document.querySelectorAll('.scan-tag');
  const scanReadout = document.querySelector('[data-scan-readout]');

  if (scanFrame) {
    let dragging = false;

    const setPos = (pct) => {
      const clamped = Math.min(96, Math.max(4, pct));
      scanFrame.style.setProperty('--scan-pos', clamped + '%');
      scanFrame.style.setProperty('--scan-clip', (100 - clamped) + '%');

      if (scanReadout) {
        scanReadout.textContent = `${Math.round(100 - clamped)} / ${Math.round(clamped)}`;
      }

      // reveal tags whose layer threshold has been crossed (inside revealed from left edge)
      // layer 1 (crust) sits at bottom = revealed first at low pct, layer 6 at top = needs more pct
      const layerThresholds = { 1: 12, 2: 22, 3: 32, 4: 45, 5: 60, 6: 78 };
      scanTags.forEach(tag => {
        const layer = Number(tag.dataset.tag);
        tag.classList.toggle('is-on', clamped >= layerThresholds[layer]);
      });
      scanLegendItems.forEach(item => {
        const layer = Number(item.dataset.legend);
        item.classList.toggle('is-active', clamped >= layerThresholds[layer]);
      });
    };

    const pctFromClientX = (clientX) => {
      const rect = scanFrame.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    const onMove = (clientX) => setPos(pctFromClientX(clientX));

    scanFrame.addEventListener('pointerdown', e => {
      dragging = true;
      scanFrame.setPointerCapture(e.pointerId);
      onMove(e.clientX);
    });
    scanFrame.addEventListener('pointermove', e => {
      if (!dragging) return;
      onMove(e.clientX);
    });
    scanFrame.addEventListener('pointerup', () => { dragging = false; });
    scanFrame.addEventListener('pointercancel', () => { dragging = false; });

    // click on legend jumps the slider to fully reveal that layer
    const legendTargetPct = { 1: 16, 2: 26, 3: 36, 4: 50, 5: 65, 6: 92 };
    scanLegendItems.forEach(item => {
      item.addEventListener('click', () => {
        const layer = Number(item.dataset.legend);
        animateTo(legendTargetPct[layer] || 50);
      });
    });

    function animateTo(target) {
      const startVal = parseFloat(getComputedStyle(scanFrame).getPropertyValue('--scan-pos')) ||
        parseFloat(scanFrame.style.getPropertyValue('--scan-pos')) || 50;
      const startTime = performance.now();
      const duration = 500;
      function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setPos(startVal + (target - startVal) * eased);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // initial gentle auto-demo: sweep once when section enters view
    let demoPlayed = false;
    const demoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !demoPlayed) {
          demoPlayed = true;
          setTimeout(() => animateTo(85), 500);
          setTimeout(() => animateTo(50), 1500);
        }
      });
    }, { threshold: 0.5 });
    demoObserver.observe(scanFrame);

    setPos(50);
  }

  /* ============================================================
     DETAIL ROWS — active highlight on scroll
     ============================================================ */
  const detailRows = document.querySelectorAll('[data-detail-row]');
  if (detailRows.length) {
    const rowObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
    detailRows.forEach(row => rowObserver.observe(row));
  }

  /* ============================================================
     SIZE CARDS (display section)
     ============================================================ */
  const sizeCards = Array.from(document.querySelectorAll('[data-size-group] .size-card'));
  sizeCards.forEach(card => {
    card.addEventListener('click', () => {
      sizeCards.forEach(c => {
        c.classList.toggle('is-active', c === card);
        c.setAttribute('aria-checked', c === card ? 'true' : 'false');
      });
      syncOrderSize(card.dataset.size);
    });
  });

  /* ============================================================
     MULTI-STEP ORDER FORM
     ============================================================ */
  const orderForm = document.querySelector('[data-order-form]');
  const orderSteps = orderForm ? Array.from(orderForm.querySelectorAll('.order-step')) : [];
  const orderSuccess = document.querySelector('[data-order-success]');
  const sizeChoiceBtns = document.querySelectorAll('[data-choice-group="size"] .choice-btn');

  let currentStep = 1;
  let selectedSize = 'medium';

  function goToStep(n) {
    currentStep = n;
    orderSteps.forEach(step => {
      step.classList.toggle('is-active', Number(step.dataset.step) === n);
    });
  }

  orderForm && orderForm.querySelectorAll('[data-step-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = Math.min(3, currentStep + 1);
      if (next === 3) updateSummary();
      goToStep(next);
    });
  });
  orderForm && orderForm.querySelectorAll('[data-step-prev]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(Math.max(1, currentStep - 1)));
  });

  sizeChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeChoiceBtns.forEach(b => b.classList.toggle('is-selected', b === btn));
      selectedSize = btn.dataset.choiceValue;
      syncSizeCards(selectedSize);
    });
  });

  function syncOrderSize(size) {
    selectedSize = size;
    sizeChoiceBtns.forEach(b => b.classList.toggle('is-selected', b.dataset.choiceValue === size));
  }
  function syncSizeCards(size) {
    sizeCards.forEach(c => {
      const match = c.dataset.size === size;
      c.classList.toggle('is-active', match);
      c.setAttribute('aria-checked', match ? 'true' : 'false');
    });
  }

  function updateSummary() {
    const data = new FormData(orderForm);
    const sizeLabel = selectedSize === 'large' ? 'Velika · Ø 28 cm' : 'Srednja · Ø 20 cm';
    const set = (sel, val) => {
      const el = orderForm.querySelector(sel);
      if (el) el.textContent = val && String(val).trim() !== '' ? val : '—';
    };
    set('[data-summary-size]', sizeLabel);
    set('[data-summary-name]', data.get('name'));
    set('[data-summary-phone]', data.get('phone'));
    set('[data-summary-date]', data.get('date'));
  }

  if (orderForm) {
    orderForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(orderForm);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const date = data.get('date') || '';
      const guests = data.get('guests') || '';
      const note = data.get('note') || '';
      const sizeLabel = selectedSize === 'large' ? 'Velika (Ø 28 cm)' : 'Srednja (Ø 20 cm)';
      const subject = encodeURIComponent('Upit za Slanu Tortu by Sneža');
      const body = encodeURIComponent(
        `Ime: ${name}\nTelefon: ${phone}\nVeličina: ${sizeLabel}\nDatum preuzimanja: ${date}\nBroj gostiju: ${guests}\nNapomena: ${note}`
      );
      window.location.href = `mailto:milospetrovic9034@gmail.com?subject=${subject}&body=${body}`;

      orderSteps.forEach(s => s.classList.remove('is-active'));
      if (orderSuccess) orderSuccess.classList.add('is-active');
      launchConfetti();
    });
  }

  /* ============================================================
     SCROLL REVEAL (generic)
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ============================================================
     CONFETTI (on successful order)
     ============================================================ */
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const colors = ['#E8472B', '#D4A857', '#3D5C3A', '#1A1410', '#F2E9DC', '#EFCB6E'];
    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 5,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 8,
        w: 6 + Math.random() * 10,
        h: 3 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    let frame, t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.vy += 0.08; p.opacity -= 0.006;
        if (p.opacity <= 0 || p.y > canvas.height + 30) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      });
      const alive = particles.some(p => p.opacity > 0 && p.y < canvas.height + 30);
      if (alive && t < 320) frame = requestAnimationFrame(draw);
      else { canvas.classList.remove('active'); cancelAnimationFrame(frame); }
    }
    draw();
  }

  /* ============================================================
     TICKER duplicate for seamless loop
     ============================================================ */
  const track = document.querySelector('.ticker-track');
  if (track) {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  }

});