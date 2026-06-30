/* =========================================================
   ASESORÍA CASCALES — Script principal
   Menú móvil, scroll, formulario, FAQ, cookies, animaciones
   ========================================================= */

(function () {
    'use strict';

    /* ---------- Helper: arrancar al cargar el DOM ---------- */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initMobileMenu();
        initHeaderScroll();
        initActiveNavLink();
        initFAQ();
        initContactForm();
        initCookieBanner();
        initBackToTop();
        initScrollReveal();
        initCurrentYear();
        initSmoothAnchors();
    }

    /* ---------- Menú móvil ---------- */
    function initMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            const isOpen = menu.classList.toggle('active');
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('no-scroll', isOpen);
        });

        // Cerrar al hacer clic en un enlace
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            });
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    /* ---------- Sombra en header al hacer scroll ---------- */
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const setScrolled = function () {
            header.classList.toggle('scrolled', window.scrollY > 8);
        };

        setScrolled();
        window.addEventListener('scroll', setScrolled, { passive: true });
    }

    /* ---------- Marcar enlace activo en el menú ---------- */
    function initActiveNavLink() {
        const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        document.querySelectorAll('.nav-menu a').forEach(function (link) {
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (!href) return;
            const file = href.split('/').pop();
            if (file === currentPage || (currentPage === '' && file === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /* ---------- FAQ acordeón ---------- */
    function initFAQ() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(function (item) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');
                // Cerrar todos
                items.forEach(function (other) {
                    other.classList.remove('open');
                    const a = other.querySelector('.faq-answer');
                    if (a) a.style.maxHeight = null;
                });
                // Abrir el actual si estaba cerrado
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    /* ---------- Formulario de contacto (validación + envío simulado) ---------- */
    function initContactForm() {
        const form = document.querySelector('#contact-form');
        if (!form) return;

        const message = form.querySelector('.form-message');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            message.className = 'form-message';
            message.textContent = '';

            const data = new FormData(form);
            const nombre = (data.get('nombre') || '').toString().trim();
            const email = (data.get('email') || '').toString().trim();
            const telefono = (data.get('telefono') || '').toString().trim();
            const mensaje = (data.get('mensaje') || '').toString().trim();
            const privacidad = form.querySelector('[name="privacidad"]')?.checked;

            // Validaciones
            if (nombre.length < 2) return showError('Introduce tu nombre completo.');
            if (!isValidEmail(email)) return showError('Introduce un correo electrónico válido.');
            if (telefono && !isValidPhone(telefono)) return showError('El teléfono no es válido.');
            if (mensaje.length < 10) return showError('El mensaje debe tener al menos 10 caracteres.');
            if (!privacidad) return showError('Debes aceptar la política de privacidad.');

            // Honeypot anti-spam
            if ((data.get('website') || '').toString().trim() !== '') return;

            // Simulación de envío (en producción, sustituir por fetch a un endpoint o servicio como Formspree)
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando…';

            setTimeout(function () {
                showSuccess('¡Mensaje enviado correctamente! Te contactaremos en menos de 24 horas laborables.');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 900);

            function showError(text) {
                message.className = 'form-message error';
                message.textContent = text;
                message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            function showSuccess(text) {
                message.className = 'form-message success';
                message.textContent = text;
                message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        function isValidEmail(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        function isValidPhone(value) {
            return /^[+\d\s().-]{7,20}$/.test(value);
        }
    }

    /* ---------- Banner de cookies ---------- */
    function initCookieBanner() {
        const banner = document.querySelector('#cookie-banner');
        if (!banner) return;
        const STORAGE_KEY = 'ac_cookies_consent_v1';

        if (!localStorage.getItem(STORAGE_KEY)) {
            setTimeout(function () { banner.classList.add('visible'); }, 800);
        }

        banner.querySelectorAll('[data-cookie-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const action = btn.getAttribute('data-cookie-action');
                localStorage.setItem(STORAGE_KEY, action);
                banner.classList.remove('visible');
            });
        });
    }

    /* ---------- Botón "Volver arriba" ---------- */
    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        const toggleVisible = function () {
            btn.classList.toggle('visible', window.scrollY > 400);
        };

        toggleVisible();
        window.addEventListener('scroll', toggleVisible, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Animaciones de aparición con IntersectionObserver ---------- */
    function initScrollReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length || !('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        items.forEach(function (el) { obs.observe(el); });
    }

    /* ---------- Año actual en el footer ---------- */
    function initCurrentYear() {
        document.querySelectorAll('[data-current-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    /* ---------- Smooth scroll para enlaces ancla ---------- */
    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                const id = link.getAttribute('href');
                if (!id || id === '#') return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }
})();
