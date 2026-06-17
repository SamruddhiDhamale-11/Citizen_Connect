/* ==========================================================
   CITIZEN CONNECT HOME PAGE
   Premium Interactive Script
   ========================================================== */

'use strict';

/* ==========================================================
   LOADER
   ========================================================== */

window.addEventListener('load', () => {

    const loader = document.getElementById('loader');

    setTimeout(() => {

        if (loader) {
            loader.style.opacity = '0';

            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }

    }, 1200);

});

/* ==========================================================
   SMOOTH SCROLL
   ========================================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener('click', function (e) {

        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });

});

/* ==========================================================
   FADE IN ANIMATION
   ========================================================== */

const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add('show');

            fadeObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

fadeElements.forEach(el => {
    fadeObserver.observe(el);
});

/* ==========================================================
   COUNTERS
   ========================================================== */

const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = Number(counter.dataset.target);

        let current = 0;

        const increment = Math.max(1, Math.ceil(target / 150));

        const updateCounter = () => {

            current += increment;

            if (current >= target) {

                counter.textContent = target.toLocaleString();

            } else {

                counter.textContent = current.toLocaleString();

                requestAnimationFrame(updateCounter);
            }

        };

        updateCounter();

        counterObserver.unobserve(counter);

    });

}, {
    threshold: 0.3
});

counters.forEach(counter => {
    counterObserver.observe(counter);
});

/* ==========================================================
   TESTIMONIAL SLIDER
   ========================================================== */

const testimonials = document.querySelectorAll('.testimonial');

let testimonialIndex = 0;

function rotateTestimonials() {

    if (!testimonials.length) return;

    testimonials.forEach((card, index) => {

        card.style.display =
            index === testimonialIndex
                ? 'block'
                : 'none';

    });

    testimonialIndex++;

    if (testimonialIndex >= testimonials.length) {
        testimonialIndex = 0;
    }
}

rotateTestimonials();

setInterval(rotateTestimonials, 4000);

/* ==========================================================
   PARALLAX HERO
   ========================================================== */

const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {

    if (!hero) return;

    const scrollY = window.pageYOffset;

    hero.style.backgroundPositionY =
        scrollY * 0.5 + 'px';

});

/* ==========================================================
   NAVBAR SCROLL EFFECT
   ========================================================== */

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {

    if (!navbar) return;

    if (window.scrollY > 60) {

        navbar.classList.add('navbar-scrolled');

    } else {

        navbar.classList.remove('navbar-scrolled');

    }

});

/* ==========================================================
   FEATURE CARD HOVER TILT
   ========================================================== */

const cards = document.querySelectorAll(
    '.feature-card, .glass-card, .service-card'
);

cards.forEach(card => {

    card.addEventListener('mousemove', e => {

        const rect = card.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;

        const rotateY =
            ((x / rect.width) - 0.5) * 10;

        const rotateX =
            ((y / rect.height) - 0.5) * -10;

        card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-8px)`;

    });

    card.addEventListener('mouseleave', () => {

        card.style.transform =
            'perspective(1000px) rotateX(0) rotateY(0)';

    });

});

/* ==========================================================
   FLOATING PARTICLES
   ========================================================== */

const particleContainer =
    document.getElementById('particles');

if (particleContainer) {

    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {

        const particle =
            document.createElement('span');

        particle.classList.add('particle');

        particle.style.left =
            Math.random() * 100 + '%';

        particle.style.animationDuration =
            8 + Math.random() * 15 + 's';

        particle.style.animationDelay =
            Math.random() * 10 + 's';

        particle.style.opacity =
            0.2 + Math.random() * 0.6;

        particle.style.width =
            3 + Math.random() * 7 + 'px';

        particle.style.height =
            particle.style.width;

        particleContainer.appendChild(particle);
    }
}

/* ==========================================================
   BUTTON RIPPLE EFFECT
   ========================================================== */

const buttons = document.querySelectorAll(
    '.btn-primary, .btn-secondary, .btn-glass'
);

buttons.forEach(button => {

    button.addEventListener('click', function (e) {

        const ripple =
            document.createElement('span');

        ripple.classList.add('ripple');

        const rect =
            this.getBoundingClientRect();

        ripple.style.left =
            e.clientX - rect.left + 'px';

        ripple.style.top =
            e.clientY - rect.top + 'px';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

    });

});

/* ==========================================================
   AUTO HIGHLIGHT NAV LINKS
   ========================================================== */

const sections =
    document.querySelectorAll('section[id]');

const navLinks =
    document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {

    let current = '';

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current =
                section.getAttribute('id');
        }

    });

    navLinks.forEach(link => {

        link.classList.remove('active');

        if (
            link.getAttribute('href')
            === '#' + current
        ) {

            link.classList.add('active');
        }

    });

});

/* ==========================================================
   HERO TEXT ANIMATION
   ========================================================== */

const heroTitle =
    document.querySelector('.hero h1');

if (heroTitle) {

    heroTitle.classList.add('hero-animate');

}

/* ==========================================================
   PROCESS STEP ANIMATION
   ========================================================== */

const processSteps =
    document.querySelectorAll('.process-step');

const processObserver =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('active-step');
            }

        });

    }, {
        threshold: 0.25
    });

processSteps.forEach(step => {
    processObserver.observe(step);
});

/* ==========================================================
   CTA FLOAT EFFECT
   ========================================================== */

const cta =
    document.querySelector('.cta');

if (cta) {

    let direction = 1;

    setInterval(() => {

        cta.style.transform =
            `translateY(${direction * 6}px)`;

        direction *= -1;

    }, 2000);

}

/* ==========================================================
   MOBILE MENU
   ========================================================== */

const hamburgerBtn =
    document.getElementById('hamburgerBtn');

const mobileMenu =
    document.getElementById('mobileMenu');

if(hamburgerBtn && mobileMenu){

    hamburgerBtn.addEventListener('click', () => {

        mobileMenu.classList.toggle('show');

        const icon =
            hamburgerBtn.querySelector('i');

        if(mobileMenu.classList.contains('show')){

            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');

        }else{

            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }

    });

}

/* ==========================================================
   END
   ========================================================== */

console.log(
    'Citizen Connect Premium Home Loaded Successfully'
);

function openRolePopup(role) {

    const popup = document.getElementById('rolePopup');
    const title = document.getElementById('popupTitle');
    const content = document.getElementById('popupContent');

    if (role === 'admin') {

        title.innerHTML = 'Administrator Portal';

        content.innerHTML = `
            <br><p>Administrator access only.</p>
            <br>
            <a href="./login/admin/admin-login.html?mode=login"
               class="popup-btn primary">
                Login Here
            </a>
        `;
    }

    else if (role === 'officials') {

        title.innerHTML = 'Officials Login';

        content.innerHTML = `
            <a href="./login/admin/admin-login.html?mode=login"
               class="popup-btn primary">
                <i class="fa-solid fa-user-tie"></i>&nbsp; Login as Admin
            </a>

            <br><br>

            <a href="#" onclick="openNestedPopup(); return false;"
               class="popup-btn secondary">
                <i class="fa-solid fa-landmark"></i>&nbsp; Login as Politician
            </a>
        `;
    }

    else if (role === 'politician') {

        title.innerHTML = 'Politician Portal';

        content.innerHTML = `
        <a href="./login/politician/politician-register.html"
           class="popup-btn primary">
           New Politician Registration
        </a>

        <br><br>

        <a href="./login/politician/politician-login.html"
           class="popup-btn secondary">
           Already Registered
        </a>
    `;
    }

    popup.classList.add('show');
}

function closeRolePopup() {

    document
        .getElementById('rolePopup')
        .classList.remove('show');
}

/* ==========================================================
   NESTED POPUP — Politician Portal (from Officials flow)
   ========================================================== */

function openNestedPopup() {

    const nested  = document.getElementById('nestedPopup');
    const title   = document.getElementById('nestedPopupTitle');
    const content = document.getElementById('nestedPopupContent');

    title.innerHTML = 'Politician Portal';

    content.innerHTML = `
        <a href="./login/politician/politician-register.html"
           class="popup-btn primary">
           New Politician Registration
        </a>

        <br><br>

        <a href="./login/politician/politician-login.html"
           class="popup-btn secondary">
           Already Registered
        </a>
    `;

    nested.classList.add('show');
}

function closeNestedPopup() {

    document
        .getElementById('nestedPopup')
        .classList.remove('show');
}

// Click outside nested popup → close only nested popup
window.addEventListener('click', function (e) {

    const nested = document.getElementById('nestedPopup');

    if (e.target === nested) {
        closeNestedPopup();
    }

});

window.addEventListener('click', function(e){

    const popup =
        document.getElementById('rolePopup');

    if(e.target === popup){

        closeRolePopup();
    }

});