import { fetchPartial, loadPartial } from '../core/dom.js';
import { makeKeyboardActivatable } from '../utils/a11y.js';

// The header element, set in setupHeaderShadow().
let headerElement = null;

// Opens or closes the mobile menu and updates aria-expanded.
function setMenuOpen(isOpen) {
    const menuWrapper = document.querySelector('.header .menu-wrapper');
    const menuButton = document.getElementById('menu-button');
    menuWrapper.classList.toggle('active', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
}

// Switches the mobile menu between open and closed.
function toggleMenu() {
    const menuWrapper = document.querySelector('.header .menu-wrapper');
    setMenuOpen(!menuWrapper.classList.contains('active'));
}

// Closes the mobile menu.
function closeMenu() {
    setMenuOpen(false);
}

// Closes the menu when Escape is pressed and returns focus to the menu button.
function closeMenuOnEscape(event) {
    const menuWrapper = document.querySelector('.header .menu-wrapper');
    const isMenuOpen = menuWrapper.classList.contains('active');
    if (event.key === 'Escape' && isMenuOpen) {
        setMenuOpen(false);
        document.getElementById('menu-button').focus();
    }
}

// Sets up the mobile menu: ARIA attributes, click/keyboard toggle,
// Escape to close, and closing when a menu link is clicked.
export function setupMobileMenu() {
    const menuButton = document.getElementById('menu-button');
    const menuWrapper = document.querySelector('.header .menu-wrapper');
    if (!menuButton || !menuWrapper) return;

    if (!menuWrapper.id) {
        menuWrapper.id = 'site-menu';
    }
    menuButton.setAttribute('aria-controls', menuWrapper.id);
    menuButton.setAttribute('aria-expanded', 'false');

    menuButton.addEventListener('click', toggleMenu);
    makeKeyboardActivatable(menuButton);
    document.addEventListener('keydown', closeMenuOnEscape);

    for (const link of menuWrapper.querySelectorAll('a')) {
        link.addEventListener('click', closeMenu);
    }
}

// Inserts the language switcher in the first placeholder and removes any extra ones
// (the header partial and the page can both include a placeholder).
function insertLanguageSwitcher(languageSwitcherHtml) {
    const placeholders = document.querySelectorAll('[id="language-switcher-placeholder"]');
    for (let index = 0; index < placeholders.length; index++) {
        if (index === 0) {
            placeholders[index].innerHTML = languageSwitcherHtml;
        } else {
            placeholders[index].remove();
        }
    }
}

// Loads the shared header, footer and language switcher into the page.
export async function loadSharedLayout() {
    await Promise.all([
        loadPartial('header-placeholder', '_header.html'),
        loadPartial('footer-placeholder', '_footer.html')
    ]);

    try {
        const languageSwitcherHtml = await fetchPartial('_language-switcher.html');
        insertLanguageSwitcher(languageSwitcherHtml);
    } catch (error) {
        console.warn('No se pudo cargar el selector de idioma:', error);
    }
}

// Adds the "scrolled" style (shadow/solid background) to the header
// when the page is scrolled, or always if the header is marked as solid.
function updateHeaderShadow() {
    const isSolidHeader = headerElement.dataset.solid === 'true';
    headerElement.classList.toggle('scrolled', isSolidHeader || window.scrollY > 10);
}

// Starts listening to scroll events to update the header style.
export function setupHeaderShadow() {
    headerElement = document.querySelector('.header');
    if (!headerElement) return;
    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow, {passive: true});
}