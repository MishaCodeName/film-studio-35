document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .project-card, .gallery-grid img, .review, .contact-form').forEach(el => {
        observer.observe(el);
    });
});

const initSlider = () => {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return; 
    let currentSlide = 0;

    let prevBtn = document.querySelector('.prev-btn');
    let nextBtn = document.querySelector('.next-btn');

    if (!prevBtn || !nextBtn) {
        prevBtn = document.createElement('button');
        prevBtn.textContent = 'Назад';
        prevBtn.classList.add('slider-btn', 'prev-btn');

        nextBtn = document.createElement('button');
        nextBtn.textContent = 'Вперёд';
        nextBtn.classList.add('slider-btn', 'next-btn');

        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.appendChild(prevBtn);
            slider.appendChild(nextBtn);
        }
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);


    showSlide(currentSlide);
};

if (document.querySelector('.hero-slider')) {
    initSlider();
}