document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormSubmission();
    initializeSmoothScrolling();
    
    // Iniciar efectos especiales del Hero
    const heroTitle = document.querySelector('.hero-title');
    if(heroTitle) {
        // Texto modificado para ser más directo
        typeWriter(heroTitle, "Convertimos ideas en resultados digitales.", 50);
    }
    window.addEventListener('scroll', throttle(parallaxHero, 10));
});

// === NAVEGACIÓN ===
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Optimización: No ejecutar si no hay navbar
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true }); // Mejora de rendimiento en scroll

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Bloquear scroll del body cuando el menú está abierto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// === ANIMACIONES DE SCROLL ===
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) {
        // Si el navegador no soporta IntersectionObserver, muestra los elementos
        elements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
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

// === EFECTO PARALLAX (OPTIMIZADO) ===
function parallaxHero() {
    const hero = document.querySelector('.hero');
    // Optimización: No ejecutar si el elemento no está en la vista
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return;
    }
    
    const scrollPosition = window.pageYOffset;
    // Se usa 'transform' para un rendimiento más fluido que 'backgroundPositionY'
    hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
}

// === FORMULARIO DE CONTACTO (CON NETLIFY AJAX) ===
function initializeFormSubmission() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                successMessage.style.display = 'flex';
                form.reset();
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            })
            .catch((error) => {
                console.error('Error al enviar el formulario:', error);
                alert('Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.');
            })
            .finally(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
}

// === SCROLLING SUAVE ===
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
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
