import { fetchPartial, loadPartial } from '../core/dom.js';
import { makeKeyboardActivatable } from '../utils/a11y.js';

let headerElement = null;

function setMenuOpen(isOpen) {
    const menuWrapper = document.querySelector('.header .menu-wrapper');
    const menuButton = document.getElementById('menu-button');
    menuWrapper.classList.toggle('active', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
}

function toggleMenu() {
    const menuWrapper = document.querySelector('.header .menu-wrapper');
    setMenuOpen(!menuWrapper.classList.contains('active'));
}

function closeMenu() {
    setMenuOpen(false);
}

function closeMenuOnEscape(event) {
    const menuWrapper = document.querySelector('.header .menu-wrapper');
    const isMenuOpen = menuWrapper.classList.contains('active');
    if (event.key === 'Escape' && isMenuOpen) {
        setMenuOpen(false);
        document.getElementById('menu-button').focus();
    }
}

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

async function fetchLanguageSwitcherHtml() {
    try {
        return await fetchPartial('_language-switcher.html');
    } catch (error) {
        console.warn('No se cargó el selector de idioma:', error);
        return null;
    }
}

function insertLanguageSwitcher(languageSwitcherHtml) {
    if (!languageSwitcherHtml) return;

    const placeholders = document.querySelectorAll('[id="language-switcher-placeholder"]');
    for (let index = 0; index < placeholders.length; index++) {
        if (index === 0) {
            placeholders[index].innerHTML = languageSwitcherHtml;
        } else {
            placeholders[index].remove();
        }
    }
}

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

function updateHeaderShadow() {
    const isSolidHeader = headerElement.dataset.solid === 'true';
    headerElement.classList.toggle('scrolled', isSolidHeader || window.scrollY > 10);
}

export function setupHeaderShadow() {
    headerElement = document.querySelector('.header');
    if (!headerElement) return;
    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow, {passive: true});
}