// ---- QualiTrack – main.js ----
// Language switching with nested dot-notation keys (e.g. "nav.home")

let currentLang = localStorage.getItem('qs-lang') || 'en';

// Flatten nested object: { "nav": { "home": "Inicio" } } → { "nav.home": "Inicio" }
function flattenTranslations(obj, prefix) {
    prefix = prefix || '';
    return Object.keys(obj).reduce(function (acc, key) {
        var fullKey = prefix ? prefix + '.' + key : key;
        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenTranslations(obj[key], fullKey));
        } else {
            acc[fullKey] = obj[key];
        }
        return acc;
    }, {});
}

function applyTranslations(lang) {
    // Pick the correct global translation object
    var source = lang === 'en' ? En : Es;
    var flat = flattenTranslations(source);

    // Apply to [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (flat[key] === undefined) return;

        // If the element has child elements (e.g. a <span> inside a price <p>),
        // only update the first TEXT node to avoid wiping inner elements.
        var hasChildElements = el.children.length > 0;
        if (hasChildElements) {
            var textNode = null;
            for (var i = 0; i < el.childNodes.length; i++) {
                if (el.childNodes[i].nodeType === Node.TEXT_NODE) {
                    textNode = el.childNodes[i];
                    break;
                }
            }
            if (textNode) {
                textNode.nodeValue = flat[key];
            } else {
                // Prepend a new text node
                el.insertBefore(document.createTextNode(flat[key]), el.firstChild);
            }
        } else {
            el.textContent = flat[key];
        }
    });

    // Apply to [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (flat[key] !== undefined) {
            el.placeholder = flat[key];
        }
    });

    // Apply to [data-i18n-html]
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-html');
        if (flat[key] !== undefined) {
            el.innerHTML = flat[key];
        }
    });

    // Update active button state on the floating switcher
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update <html lang>
    document.documentElement.lang = lang;
}

// ---- Language Switcher ----
document.addEventListener('DOMContentLoaded', function () {
    applyTranslations(currentLang);

    // Floating switcher buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            currentLang = btn.dataset.lang;
            localStorage.setItem('qs-lang', currentLang);
            applyTranslations(currentLang);
        });
    });

    // ---- Mobile Nav Toggle ----
    var menuBtn = document.getElementById('menu-btn');
    var navbar = document.querySelector('.header .navbar');

    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', function () {
            navbar.classList.toggle('active');
        });
        // Close on nav link click (mobile)
        navbar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navbar.classList.remove('active');
            });
        });
    }

    // ---- Plans toggle (Monthly / Annually) ----
    var toggleBtns = document.querySelectorAll('.toggle-btn');
    var monthlyPrices = document.querySelectorAll('.monthly-price');
    var annuallyPrices = document.querySelectorAll('.annually-price');
    var annualSaveLabels = document.querySelectorAll('.annual-save');

    toggleBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            toggleBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var plan = btn.dataset.plan;
            if (plan === 'monthly') {
                monthlyPrices.forEach(function (el) { el.style.display = ''; });
                annuallyPrices.forEach(function (el) { el.style.display = 'none'; });
                annualSaveLabels.forEach(function (el) { el.style.display = 'none'; });
            } else {
                monthlyPrices.forEach(function (el) { el.style.display = 'none'; });
                annuallyPrices.forEach(function (el) { el.style.display = ''; });
                annualSaveLabels.forEach(function (el) { el.style.display = ''; });
            }
        });
    });

    // ---- Accordion ----
    var accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(function (item) {
        var title = item.querySelector('.accordion-title');
        if (!title) return;
        title.addEventListener('click', function () {
            var isOpen = item.classList.contains('active');
            // Close all
            accordionItems.forEach(function (i) { i.classList.remove('active'); });
            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    // Open first accordion item by default
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }

    // ---- Scroll-reveal animation ----
    var revealEls = document.querySelectorAll(
        '.offer-box, .benefit-card-image, .team-member, .plan-card, .accordion-item, .review-card'
    );

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach(function (el) {
            el.classList.add('reveal-hidden');
            observer.observe(el);
        });
    }

    // ---- Sticky header shadow on scroll ----
    var header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    // ---- Footer subscribe ----
    var subscribeBtn = document.querySelector('.top-footer .subscribe-btn');
    var subscribeInput = document.querySelector('.top-footer input[type="email"]');
    if (subscribeBtn && subscribeInput) {
        subscribeBtn.addEventListener('click', function () {
            var email = subscribeInput.value.trim();
            if (!email || !email.includes('@')) {
                subscribeInput.style.borderColor = '#e74c3c';
                return;
            }
            subscribeInput.style.borderColor = '';
            subscribeInput.value = '';
            subscribeBtn.textContent = currentLang === 'es' ? '✅ ¡Enviado!' : '✅ Sent!';
            setTimeout(function () {
                applyTranslations(currentLang); // restore button text
            }, 3000);
        });
    }
});
