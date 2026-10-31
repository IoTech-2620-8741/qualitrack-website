// ---- QualiTrack – main.js ----
// Language switching with nested dot-notation keys (e.g. "nav.home")

let currentLang = localStorage.getItem('qs-lang') || 'en';

// Root of the site, taken from this script's location (public/assets/scripts/main.js), so the shared
// header and footer work from index.html and from the pages in public/sections.
var SITE_ROOT = new URL('../../../', document.currentScript.src).href;

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
    document.querySelectorAll('.language-button').forEach(function (button) {
        button.classList.toggle('active', button.dataset.lang === lang);
    });

    // Update <html lang>
    document.documentElement.lang = lang;
}

// ---- Shared header and footer ----
// Each page has <div id="header-placeholder">, <div id="footer-placeholder"> and <div id="language-switcher-placeholder">, replaced by
// public/_header.html, public/_footer.html and public/_language-switcher.html. In those files {{home}} is the home page ("" on the
// home page itself, so its links only scroll) and {{root}} is the root of the site.
function loadSharedLayout() {
    var homeUrl = new URL('public/index.html', SITE_ROOT);
    var onHome = location.pathname === new URL(SITE_ROOT).pathname || location.pathname === homeUrl.pathname;
    var parts = [['header-placeholder', '_header.html'], ['footer-placeholder', '_footer.html'], ['language-switcher-placeholder', '_language-switcher.html']];

    return Promise.all(parts.map(function (part) {
        var placeholder = document.getElementById(part[0]);
        if (!placeholder) return null;
        return fetch(SITE_ROOT + 'public/' + part[1])
            .then(function (response) {
                if (!response.ok) throw new Error(part[1] + ' could not be loaded');
                return response.text();
            })
            .then(function (html) {
                var template = document.createElement('template');
                template.innerHTML = html
                    .replace(/\{\{home\}\}/g, onHome ? '' : homeUrl.href)
                    .replace(/\{\{root\}\}/g, SITE_ROOT);
                var element = template.content.firstElementChild;
                // Pages without a hero image keep the solid header (data-solid on the placeholder).
                if (placeholder.hasAttribute('data-solid')) {
                    element.classList.add('scrolled');
                    element.dataset.solid = 'true';
                }
                placeholder.replaceWith(template.content);
            });
    }));
}

// ---- Language Switcher ----
document.addEventListener('DOMContentLoaded', function () {
    loadSharedLayout().then(initPage, function (error) {
        console.warn('Shared layout not loaded:', error);
        initPage();
    });
});

function initPage() {
    applyTranslations(currentLang);

    // Floating switcher buttons
    document.querySelectorAll('.language-button').forEach(function (button) {
        button.addEventListener('click', function () {
            currentLang = button.dataset.lang;
            localStorage.setItem('qs-lang', currentLang);
            applyTranslations(currentLang);
        });
    });

    // ---- Mobile Nav Toggle ----
    var menuButton = document.getElementById('menu-button');
    var menuWrapper = document.querySelector('.header .menu-wrapper');

    if (menuButton && menuWrapper) {
        menuButton.addEventListener('click', function () {
            menuWrapper.classList.toggle('active');
        });
        // Close on nav link click (mobile)
        menuWrapper.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menuWrapper.classList.remove('active');
            });
        });
    }

    // ---- Plans toggle (Monthly / Annually) ----
    var toggleButtons = document.querySelectorAll('.toggle-button');
    var monthlyPrices = document.querySelectorAll('.monthly-price');
    var annuallyPrices = document.querySelectorAll('.annually-price');
    var annualSaveLabels = document.querySelectorAll('.annual-save');
    var planCards = document.querySelectorAll('.plan-card');

    //Subscription plan values map
    var SUBSCRIPTION_PLAN_MAP = {
        standard: 'BASIC',
        enterprise: 'ENTERPRISE'
    };

    //Update subscription plan links acording to selected button
    function updatePlanLinks(selectedToggle) {
        var billingCycle = selectedToggle === 'annually' ? 'YEARLY' : 'MONTHLY';
        planCards.forEach(function (card) {
            var planKey = card.dataset.planType;
            var planValue = SUBSCRIPTION_PLAN_MAP[planKey];
            var ctaLink = card.querySelector('a.button');
            if (planValue && ctaLink) {
                ctaLink.href = 'https://qualitrack-iotech.web.app/iam/sign-up?plan=' + planValue + '&billingCycle=' + billingCycle;
            }
        });
    }

    toggleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            toggleButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            button.classList.add('active');

            var plan = button.dataset.plan;
            if (plan === 'monthly') {
                monthlyPrices.forEach(function (el) {
                    el.style.display = '';
                });
                annuallyPrices.forEach(function (el) {
                    el.style.display = 'none';
                });
                annualSaveLabels.forEach(function (el) {
                    el.style.display = 'none';
                });
            } else {
                monthlyPrices.forEach(function (el) {
                    el.style.display = 'none';
                });
                annuallyPrices.forEach(function (el) {
                    el.style.display = '';
                });
                annualSaveLabels.forEach(function (el) {
                    el.style.display = '';
                });
            }

            // Updates subscription plan links
            updatePlanLinks(plan);
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
            accordionItems.forEach(function (i) {
                i.classList.remove('active');
            });
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
        }, {threshold: 0.12});

        revealEls.forEach(function (el) {
            el.classList.add('reveal-hidden');
            observer.observe(el);
        });
    }

    // ---- Sticky header shadow on scroll ----
    var header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', header.dataset.solid === 'true' || window.scrollY > 10);
        });
    }

    // ---- Footer subscribe ----
    var subscribeButton = document.querySelector('.top-footer .subscribe-button');
    var subscribeInput = document.querySelector('.top-footer input[type="email"]');
    if (subscribeButton && subscribeInput) {
        subscribeButton.addEventListener('click', function () {
            var email = subscribeInput.value.trim();
            if (!email || !email.includes('@')) {
                subscribeInput.style.borderColor = '#e74c3c';
                return;
            }
            subscribeInput.style.borderColor = '';
            subscribeInput.value = '';
            subscribeButton.textContent = currentLang === 'es' ? '✅ ¡Enviado!' : '✅ Sent!';
            setTimeout(function () {
                applyTranslations(currentLang); // restore button text
            }, 3000);
        });
    }
}
