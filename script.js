// script.js
document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     Smooth in-page scrolling
     ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      const target = href && document.querySelector(href);
      if (!target) return; // let browser handle if no target
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* =========================
     Contact form (AJAX, no redirect)
     ========================= */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          if (status) status.textContent = 'Thanks! Message sent 👍';
          form.reset();
        } else {
          if (status) status.textContent = 'Hmm… something went wrong.';
        }
      } catch {
        if (status) status.textContent = 'Network error – please try again later.';
      }
    });
  }

  /* =========================
     Fancy theme switcher button
     Controls: html[data-theme="dark"]
     ========================= */
  const switcher = document.getElementById('theme-switcher-grid');
  
  if (switcher) {
    // Determine starting theme (saved > system preference)
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startDark = saved ? saved === 'dark' : prefersDark;

    if (startDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      switcher.classList.add('night-theme');
      switcher.setAttribute('aria-pressed', 'true');
      window.dispatchEvent(new Event('themeChange')); // sync bg.js
    } else {
      switcher.setAttribute('aria-pressed', 'false');
    }

    // Toggle on click
    switcher.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        switcher.classList.remove('night-theme');
        switcher.setAttribute('aria-pressed', 'false');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        switcher.classList.add('night-theme');
        switcher.setAttribute('aria-pressed', 'true');
      }

      // Let bg.js re-pull CSS variables for fog/mesh colors
      window.dispatchEvent(new Event('themeChange'));
    });
  }
});

