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
