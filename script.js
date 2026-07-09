// ==========================================================
// script.js — Ashik Muhammad Asharaf Portfolio
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initNavbarScroll();
    initMobileNav();
    initActiveNavLink();
    initScrollReveal();
    initModalCloseOnOverlay();
    initParticleBackground();
});

// ----------------------------------------------------------
// 1. Typewriter effect in hero subtitle
// ----------------------------------------------------------
function initTypewriter() {
    const el = document.getElementById('typed-subtitle');
    if (!el || typeof Typed === 'undefined') return;

    new Typed('#typed-subtitle', {
        strings: [
            'AI & Data Scientist',
            'Machine Learning Engineer',
            'Turning Data into Decisions',
            'NLP & Predictive Analytics'
        ],
        typeSpeed: 50,
        backSpeed: 28,
        backDelay: 1600,
        startDelay: 300,
        loop: true,
        smartBackspace: true
    });
}

// ----------------------------------------------------------
// 2. Navbar background on scroll
// ----------------------------------------------------------
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const toggleScrolled = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    toggleScrolled();
    window.addEventListener('scroll', toggleScrolled, { passive: true });
}

// ----------------------------------------------------------
// 3. Mobile nav toggle
// ----------------------------------------------------------
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    // Close mobile menu after clicking a link
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });
}

// ----------------------------------------------------------
// 4. Highlight active section link while scrolling
// ----------------------------------------------------------
function initActiveNavLink() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const setActive = (id) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

// ----------------------------------------------------------
// 5. Scroll-reveal animation for .reveal elements
// ----------------------------------------------------------
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    // Stagger reveal for elements that share a parent container
    const staggerMap = new Map();
    revealEls.forEach(el => {
        const parent = el.parentElement;
        const count = staggerMap.get(parent) || 0;
        el.style.transitionDelay = `${Math.min(count * 70, 400)}ms`;
        staggerMap.set(parent, count + 1);
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
}

// ----------------------------------------------------------
// 6. Modal open / close
// ----------------------------------------------------------
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Close modal by clicking outside content, or pressing Escape
function initModalCloseOnOverlay() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                }
            });
        }
    });
}

// ----------------------------------------------------------
// 7. Ambient particle / constellation background (canvas)
// ----------------------------------------------------------
function initParticleBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, particles;
    const PARTICLE_COUNT = 70;
    const LINK_DISTANCE = 130;
    const accentColor = '94, 234, 212';   // --accent
    const accent2Color = '129, 140, 248'; // --accent-2

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.6 + 0.6
        }));
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        // Update + draw particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentColor}, 0.55)`;
            ctx.fill();
        });

        // Draw connecting lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < LINK_DISTANCE) {
                    const opacity = (1 - dist / LINK_DISTANCE) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${accent2Color}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        if (!prefersReducedMotion) {
            requestAnimationFrame(step);
        }
    }

    resize();
    createParticles();
    step();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            createParticles();
            if (prefersReducedMotion) step();
        }, 200);
    });
}
