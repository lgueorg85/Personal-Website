//script.js
// Smooth in-page scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    event.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Contact form submission handler
document.getElementById('contactForm').addEventListener('submit', async event => {
  event.preventDefault(); // Stay on the page

  const form   = event.target;
  const data   = Object.fromEntries(new FormData(form));
  const status = document.getElementById('formStatus');

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      status.textContent = 'Thanks! Message sent 👍';
      form.reset();
    } else {
      status.textContent = 'Hmm… something went wrong.';
    }
  } catch {
    status.textContent = 'Network error – please try again later.';
  }
});

const toggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  toggleBtn.textContent = '☀️ Light Mode';
}

toggleBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    toggleBtn.textContent = '🌙 Dark Mode';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    toggleBtn.textContent = '☀️ Light Mode';
  }

  // Notify bg.js to update
  window.dispatchEvent(new Event('themeChange'));
});

