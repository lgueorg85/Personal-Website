// smooth in-page scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
            .scrollIntoView({behavior:'smooth'});
  });
});

document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const res = await r.json();
    document.getElementById('formStatus').textContent =
      res.ok ? 'Thanks! Message sent.' : 'Something went wrong.';
    if (res.ok) e.target.reset();
  } catch {
    document.getElementById('formStatus').textContent = 'Server error.';
  }
});
