'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── smooth scroll ── */
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

  /* ── header scroll state ── */
  const header = document.querySelector('[data-header]');
  if (header) {
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ── hamburger ── */
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

  /* ── BUILDER: scroll-driven cake layer reveal ── */
  const builder = document.querySelector('.builder');
  const steps = Array.from(document.querySelectorAll('.step'));
  const layers = document.querySelectorAll('.cake-layer');
  const callouts = document.querySelectorAll('.layer-callout');

  const LAYER_COLORS = {
    1: '#c8a25a',
    2: '#5e7a3c',
    3: '#e8d8a0',
    4: '#cc7057',
    5: '#c4401a',
    6: '#e8c860'
  };

  if (builder && steps.length) {
    let currentStep = 0;
    let allLayersVisible = false;

    const setStep = (n) => {
      if (n === currentStep) return;
      currentStep = n;

      builder.setAttribute('data-active-step', String(n));

      steps.forEach(step => {
        step.classList.toggle('is-active', Number(step.dataset.step) === n);
      });

      layers.forEach(layer => {
        const layerN = Number(layer.dataset.layer);
        if (layerN <= n) {
          layer.classList.remove('hidden');
          layer.classList.add('visible');
        } else {
          layer.classList.add('hidden');
          layer.classList.remove('visible');
        }
      });

      callouts.forEach(c => {
        const layerN = Number(c.dataset.callout);
        c.classList.toggle('is-visible', layerN === n);
      });

      if (n === 6 && !allLayersVisible) {
        allLayersVisible = true;
        setTimeout(() => launchConfetti(), 400);
      }
    };

    setStep(0);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setStep(Number(entry.target.dataset.step));
        }
      });
    }, {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    });

    steps.forEach(step => observer.observe(step));
  }

  /* ── Size picker ── */
  const sizeCards = Array.from(document.querySelectorAll('[data-size-group] .size-card'));

  sizeCards.forEach(card => {
    card.addEventListener('click', () => {
      sizeCards.forEach(c => {
        c.classList.toggle('is-active', c === card);
        c.setAttribute('aria-checked', c === card ? 'true' : 'false');
      });

      const size = card.dataset.size;
      syncFormSize(size);
    });
  });

  /* ── Form size toggle ── */
  const formSizeBtns = Array.from(document.querySelectorAll('[data-form-size-option]'));
  const formSizeInput = document.querySelector('[data-form-size-value]');

  formSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      formSizeBtns.forEach(b => b.classList.toggle('is-active', b === btn));
      if (formSizeInput) formSizeInput.value = btn.dataset.formSizeOption;

      sizeCards.forEach(c => {
        const match = c.dataset.size === btn.dataset.formSizeOption;
        c.classList.toggle('is-active', match);
        c.setAttribute('aria-checked', match ? 'true' : 'false');
      });
    });
  });

  function syncFormSize(size) {
    formSizeBtns.forEach(b => b.classList.toggle('is-active', b.dataset.formSizeOption === size));
    if (formSizeInput) formSizeInput.value = size;
  }

  /* ── Order form ── */
  const orderForm = document.querySelector('[data-order-form]');
  const successMsg = document.querySelector('[data-form-success]');

  if (orderForm) {
    orderForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(orderForm);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const size = data.get('size') || 'medium';
      const note = data.get('note') || '';
      const sizeLabel = size === 'large' ? 'Velika' : 'Srednja';
      const subject = encodeURIComponent('Upit za Slanu Tortu by Sneža');
      const body = encodeURIComponent(`Ime: ${name}\nTelefon: ${phone}\nVeličina: ${sizeLabel}\nPoruka: ${note}`);
      window.location.href = `mailto:milospetrovic9034@gmail.com?subject=${subject}&body=${body}`;
      if (successMsg) successMsg.classList.add('is-visible');
    });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

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

  /* ── Hero tilt on mouse ── */
  const heroFloat = document.querySelector('.hero-float-inner');
  if (heroFloat) {
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      heroFloat.style.transform = `translate(${dx * 10}px, ${dy * 6 - 0}px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
    }, { passive: true });
  }

  /* ── CONFETTI PARTICLES ── */
  function launchConfetti() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const colors = ['#c4401a', '#e8a840', '#5e7a3c', '#cc7057', '#fdf0d8', '#e8c860', '#2b1b12'];
    const particles = [];

    for (let i = 0; i < 110; i++) {
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

    let frame;
    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.vy += 0.08;
        p.opacity -= 0.006;

        if (p.opacity <= 0 || p.y > canvas.height + 30) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      });

      const alive = particles.some(p => p.opacity > 0 && p.y < canvas.height + 30);
      if (alive && t < 300) {
        frame = requestAnimationFrame(draw);
      } else {
        canvas.classList.remove('active');
        cancelAnimationFrame(frame);
      }
    }

    draw();
  }

  /* ── Teaser marquee duplicate ── */
  const track = document.querySelector('.teaser-track');
  if (track) {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  }
});