document.addEventListener('DOMContentLoaded', () => {
  /* ---------- smooth anchor scroll ---------- */
  document.querySelectorAll('[data-scroll-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- header scroll state ---------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const updateHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  /* ---------- hamburger / mobile nav ---------- */
  const burger = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (burger && mobileNav) {
    const closeMobileNav = () => {
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('sc-nav-open');
    };

    const openMobileNav = () => {
      burger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('is-open');
      document.body.classList.add('sc-nav-open');
    };

    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileNav() : openMobileNav();
    });

    mobileNav.querySelectorAll('[data-mobile-link]').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  /* ---------- builder: scroll-driven cake layer reveal ---------- */
  const builder = document.querySelector('.builder');
  const steps = Array.from(document.querySelectorAll('.step'));

  if (builder && steps.length) {
    const setActiveStep = (stepNumber) => {
      builder.setAttribute('data-active-step', String(stepNumber));
      steps.forEach((step) => {
        const isActive = Number(step.dataset.step) <= stepNumber;
        step.classList.toggle('is-active', isActive);
      });
    };

    setActiveStep(1);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.dataset.step));
          }
        });
      },
      {
        root: null,
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    );

    steps.forEach((step) => observer.observe(step));
  }

  /* ---------- size picker (display section) ---------- */
  const sizeButtons = Array.from(document.querySelectorAll('[data-size-group] .size-card'));

  sizeButtons.forEach((card) => {
    card.addEventListener('click', () => {
      sizeButtons.forEach((other) => {
        other.classList.toggle('is-active', other === card);
        other.setAttribute('aria-checked', other === card ? 'true' : 'false');
      });

      const chosenSize = card.dataset.size;
      const formButtons = document.querySelectorAll('[data-form-size-option]');
      const formValue = document.querySelector('[data-form-size-value]');

      formButtons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.formSizeOption === chosenSize);
      });

      if (formValue) {
        formValue.value = chosenSize;
      }
    });
  });

  /* ---------- size toggle inside order form ---------- */
  const formSizeButtons = Array.from(document.querySelectorAll('[data-form-size-option]'));
  const formSizeValue = document.querySelector('[data-form-size-value]');

  formSizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      formSizeButtons.forEach((other) => other.classList.toggle('is-active', other === btn));
      if (formSizeValue) {
        formSizeValue.value = btn.dataset.formSizeOption;
      }

      sizeButtons.forEach((card) => {
        const match = card.dataset.size === btn.dataset.formSizeOption;
        card.classList.toggle('is-active', match);
        card.setAttribute('aria-checked', match ? 'true' : 'false');
      });
    });
  });

  /* ---------- order form submit (mailto handoff) ---------- */
  const orderForm = document.querySelector('[data-order-form]');
  const successMessage = document.querySelector('[data-form-success]');

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(orderForm);
      const name = formData.get('name') || '';
      const phone = formData.get('phone') || '';
      const size = formData.get('size') || 'medium';
      const note = formData.get('note') || '';
      const sizeLabel = size === 'large' ? 'Velika' : 'Srednja';

      const subject = encodeURIComponent('Upit za Savory Cake');
      const body = encodeURIComponent(
        `Ime: ${name}\nTelefon: ${phone}\nVeličina: ${sizeLabel}\nPoruka: ${note}`
      );

      window.location.href = `mailto:milospetrovic9034@gmail.com?subject=${subject}&body=${body}`;

      if (successMessage) {
        successMessage.classList.add('is-visible');
      }
    });
  }
});