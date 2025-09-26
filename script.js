document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormSubmission();
    initializeSmoothScrolling();
    initializeTestimonials();
    
    // Iniciar efectos especiales del Hero
    const heroTitle = document.querySelector('.hero-title');
    if(heroTitle) {
        typeWriter(heroTitle, "Diseñamos la página web perfecta para tu negocio", 50);
    }
    window.addEventListener('scroll', throttle(parallaxHero, 10));
});

// === NAVEGACIÓN ===
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// === ANIMACIONES DE SCROLL ===
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Aplicar un retraso escalonado
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
}

// === EFECTO DE ESCRITURA (TYPEWRITER) ===
function typeWriter(element, text, speed) {
    let i = 0;
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// === EFECTO PARALLAX ===
function parallaxHero() {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.pageYOffset;
    hero.style.backgroundPositionY = scrollPosition * 0.7 + 'px';
}

// === CARRUSEL DE TESTIMONIOS ===
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let intervalId;

    function showTestimonial(index) {
        testimonials.forEach((card, i) => {
            card.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.slide);
            currentIndex = index;
            showTestimonial(currentIndex);
            resetInterval();
        });
    });

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(nextTestimonial, 5000);
    }

    intervalId = setInterval(nextTestimonial, 5000);
}


// === FORMULARIO DE CONTACTO ===
function initializeFormSubmission() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulación de envío
            successMessage.style.display = 'block';
            form.reset();
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 4000);
        });
    }
}

// === SCROLLING SUAVE ===
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// === OPTIMIZACIÓN DE RENDIMIENTO (THROTTLE) ===
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}