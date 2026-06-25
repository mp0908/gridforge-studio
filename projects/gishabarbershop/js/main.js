/* ============================================================
   GIŠA BARBERSHOP — interactions
   ============================================================ */
(function(){
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Page loader ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader){
      setTimeout(() => loader.classList.add('hide'), 280);
    }
  });

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  if (cursor && cursorRing && !reduceMotion && window.matchMedia('(min-width:901px)').matches){
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    function ringLoop(){
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    const hoverTargets = 'a, button, .service-card, .gallery-item, .team-card, input, select, textarea, .review-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.remove('is-active');
    });
  }

  /* ---------- Navbar scroll state + scroll progress ---------- */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');

  function onScroll(){
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
    if (progressBar) progressBar.style.width = pct + '%';
    if (backTop) backTop.classList.toggle('show', scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop){
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu(){
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
    burger.classList.add('is-open');
  }
  function closeMenu(){
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    burger.classList.remove('is-open');
  }
  if (burger && mobileMenu){
    burger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileMenu){
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter');
  function animateCounter(el){
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && 'IntersectionObserver' in window){
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ---------- Service card mouse-follow glow ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Gallery drag-to-scroll ---------- */
  const galleryScroll = document.getElementById('galleryScroll');
  if (galleryScroll){
    let isDown = false, startX, scrollLeft, moved = false;

    galleryScroll.addEventListener('mousedown', (e) => {
      isDown = true; moved = false;
      galleryScroll.classList.add('dragging');
      startX = e.pageX - galleryScroll.offsetLeft;
      scrollLeft = galleryScroll.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
      galleryScroll.classList.remove('dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      moved = true;
      const x = e.pageX - galleryScroll.offsetLeft;
      const walk = (x - startX) * 1.4;
      galleryScroll.scrollLeft = scrollLeft - walk;
    });
    // Prevent accidental image click-through after a drag
    galleryScroll.addEventListener('click', (e) => {
      if (moved) e.preventDefault();
    }, true);
  }

  /* ---------- Contact form (demo submit) ---------- */
  const formSubmit = document.getElementById('formSubmit');
  const formSuccess = document.getElementById('formSuccess');
  if (formSubmit && formSuccess){
    formSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('fname');
      if (name && !name.value.trim()){
        name.focus();
        name.style.borderColor = 'var(--burgundy-light)';
        setTimeout(() => { name.style.borderColor = ''; }, 1500);
        return;
      }
      formSuccess.classList.add('show');
      formSubmit.textContent = '✓ Zahtev poslat';
      formSubmit.style.opacity = '.85';
      formSubmit.disabled = true;
    });
  }

  /* ---------- Smooth-scroll for in-page anchors (offset for fixed nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

})();