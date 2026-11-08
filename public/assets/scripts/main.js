import { initializeLanguage, applyTranslations, setupLanguageSwitcher } from './core/i18n.js';
import { state } from './core/state.js';
import { loadSharedLayout, setupMobileMenu, setupHeaderShadow } from './ui/layout.js';
import { setupPlansToggle } from './ui/plans.js';
import { setupAccordion } from './ui/accordion.js';
import { setupScrollReveal } from './ui/animations.js';
import { hideDecorativeIcons } from './utils/a11y.js';

// Initializes all page features. Runs after the shared header/footer are in the DOM.
function initPage() {
    hideDecorativeIcons();
    setupLanguageSwitcher();
    setupMobileMenu();
    setupPlansToggle();
    setupAccordion();
    setupScrollReveal();
    setupHeaderShadow();
    applyTranslations(state.currentLanguageCode);
}

// Entry point: detects the language, loads the shared layout, then starts the page.
async function startSite() {
    initializeLanguage();
    try {
        await loadSharedLayout();
    } catch (error) {
        console.warn('No se cargó el layout compartido:', error);
    }
    initPage();
}

// Start once the DOM is ready (or immediately if it already is).
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSite);
} else {
    startSite();
}