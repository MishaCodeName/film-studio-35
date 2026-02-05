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


// Задание 6

const initProjectsSearchSort = () => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const grid = document.querySelector('.projects-grid');

    if (!searchInput || !sortSelect || !grid) return;

    const allCards = Array.from(grid.querySelectorAll('.project-card'));

    function updateCards() {
        const query = searchInput.value.trim().toLowerCase();
        const sortMode = sortSelect.value;

        let visibleCards = allCards.filter(card => {
            if (!query) return true;

            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const year = card.dataset.year || '';
            const genre = card.dataset.genre?.toLowerCase() || '';

            return title.includes(query) ||
                   year.includes(query) ||
                   genre.includes(query);
        });

        if (sortMode) {
            visibleCards.sort((a, b) => {
                if (sortMode === 'title-asc') {
                    return a.dataset.title.localeCompare(b.dataset.title, 'ru');
                }
                if (sortMode === 'title-desc') {
                    return b.dataset.title.localeCompare(a.dataset.title, 'ru');
                }
                if (sortMode === 'year-desc') {
                    return Number(b.dataset.year) - Number(a.dataset.year);
                }
                if (sortMode === 'year-asc') {
                    return Number(a.dataset.year) - Number(b.dataset.year);
                }
                return 0;
            });
        }

        grid.innerHTML = '';

        if (visibleCards.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = 'Ничего не найдено';
            msg.style.padding = '4rem 1rem';
            msg.style.textAlign = 'center';
            msg.style.fontSize = '1.4rem';
            msg.style.color = '#777';
            grid.appendChild(msg);
        } else {
            visibleCards.forEach(card => grid.appendChild(card));
        }
    }

    searchInput.addEventListener('input', updateCards);
    sortSelect.addEventListener('change', updateCards);

    updateCards();
};

if (document.querySelector('.search-bar.compact')) {
    initProjectsSearchSort();
}

// Задание 7
const initProjectDetail = () => {
    if (!document.querySelector('.project-detail')) return;

    const galleryImages = document.querySelectorAll('.gallery-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    if (galleryImages.length > 0 && lightbox) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.remove('hidden');
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        });

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) {
                closeBtn.click();
            }
        });
    }

    const reviewForm = document.getElementById('reviewForm');
    const reviewAuthor = document.getElementById('reviewAuthor');
    const reviewText = document.getElementById('reviewText');
    const reviewsSection = document.querySelector('.reviews');

    if (reviewForm && reviewsSection) {
        const projectId = 'project1'; 
        let reviews = JSON.parse(localStorage.getItem(`reviews_${projectId}`)) || [];

        function renderReviews() {
            const existingReviews = reviewsSection.querySelectorAll('.review.dynamic');
            existingReviews.forEach(el => el.remove());

            reviews.forEach(review => {
                const div = document.createElement('div');
                div.classList.add('review', 'dynamic');
                div.innerHTML = `
                    <p class="review-author">${review.author} • ${new Date(review.date).toLocaleDateString('ru-RU')}</p>
                    <p>${review.text}</p>
                `;
                reviewsSection.appendChild(div);
            });
        }

        renderReviews(); 

        reviewForm.addEventListener('submit', e => {
            e.preventDefault();

            const author = reviewAuthor.value.trim();
            const text = reviewText.value.trim();

            if (author && text) {
                reviews.push({
                    author,
                    text,
                    date: new Date().toISOString()
                });

                localStorage.setItem(`reviews_${projectId}`, JSON.stringify(reviews));

                reviewAuthor.value = '';
                reviewText.value = '';

                renderReviews();
            }
        });
    }
};

if (document.querySelector('.project-detail')) {
    initProjectDetail();
}

// Задание 8

const initFormValidation = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const roleSelect = document.getElementById('role');
    const messageTextarea = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const roleError = document.getElementById('roleError');
    const messageError = document.getElementById('messageError');
    const successMsg = document.getElementById('formSuccess');

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();

        let isValid = true;

        [nameError, emailError, roleError, messageError].forEach(el => el.textContent = '');
        successMsg.classList.add('hidden');

        if (!nameInput.value.trim()) {
            nameError.textContent = 'Пожалуйста, введите имя';
            isValid = false;
        }

        if (!emailInput.value.trim()) {
            emailError.textContent = 'Пожалуйста, введите email';
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Некорректный email';
            isValid = false;
        }

        if (!roleSelect.value) {
            roleError.textContent = 'Выберите тему обращения';
            isValid = false;
        }

        if (!messageTextarea.value.trim()) {
            messageError.textContent = 'Напишите сообщение';
            isValid = false;
        }

        if (isValid) {
            successMsg.classList.remove('hidden');
            form.reset(); 
        }
    });
};

if (document.getElementById('contactForm')) {
    initFormValidation();
}