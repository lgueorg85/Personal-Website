document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-menu');

    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


function createCalendar(element, year, month) {
    let calendar = document.querySelector(element);
    let date = new Date(year, month - 1);
    // Generate calendar here
    // ...
    calendar.innerHTML = generatedCalendarContent;
}

createCalendar('#calendar', 2023, 11); // Example: for November 2023

document.getElementById('contact-form').addEventListener('submit', function(event) {
    let isValid = true;
    // Add validation checks here
    // ...
    if (!isValid) {
        event.preventDefault(); // Prevent form submission if not valid
    }
});

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.style.display = 'none');
    slides[index].style.display = 'block';
}

document.getElementById('next-btn').addEventListener('click', function() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

document.getElementById('prev-btn').addEventListener('click', function() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});

showSlide(currentSlide); // Initialize the first slide
