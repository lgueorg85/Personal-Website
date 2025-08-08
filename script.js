// smooth in-page scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
            .scrollIntoView({behavior:'smooth'});
  });
});

document.getElementById('contactForm').addEventListener('submit', async (e)=>{
  e.preventDefault();                      // stay on the page
  const form   = e.target;
  const data   = Object.fromEntries(new FormData(form));
  const status = document.getElementById('formStatus');

  try{
    const r   = await fetch(form.action, {
      method : 'POST',
      headers: { 'Accept': 'application/json' },
      body   : JSON.stringify(data)
    });
    if(r.ok){
      status.textContent = 'Thanks! Message sent 👍';
      form.reset();
    }else{
      status.textContent = 'Hmm… something went wrong.';
    }
  }catch{
    status.textContent = 'Network error – please try again later.';
  }
});
