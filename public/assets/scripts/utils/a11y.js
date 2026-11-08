import { translate } from '../core/i18n.js';
import { state } from '../core/state.js';

// Sets the aria-label of the mobile menu button in the current language.
function updateMenuButtonLabel() {
    const menuButton = document.getElementById('menu-button');
    if (!menuButton) return;
    const fallbackText = state.currentLanguageCode === 'es' ? 'Menú' : 'Menu';
    menuButton.setAttribute('aria-label', translate('a11y.menu', fallbackText));
}

// Sets the aria-label of the main navigation bar in the current language.
function updateNavigationLabel() {
    const navigationBar = document.querySelector('.navigation-bar');
    if (!navigationBar) return;
    const fallbackText = state.currentLanguageCode === 'es' ? 'Navegación principal' : 'Main navigation';
    navigationBar.setAttribute('aria-label', translate('a11y.mainNav', fallbackText));
}

// Labels the EN/ES buttons with their language name so screen readers pronounce them correctly.
function updateLanguageButtonLabels() {
    for (const button of document.querySelectorAll('.language-button')) {
        const buttonLanguageCode = button.dataset.lang;
        button.setAttribute('lang', buttonLanguageCode);
        button.setAttribute('aria-label', buttonLanguageCode === 'es' ? 'Español' : 'English');
    }
}

// Counts the star icons in each review and sets a label like "4.5 out of 5 stars".
function updateStarRatingLabels() {
    const fallbackText = state.currentLanguageCode === 'es' ? '{n} de 5 estrellas' : '{n} out of 5 stars';
    const labelTemplate = translate('a11y.stars', fallbackText);

    for (const starsContainer of document.querySelectorAll('.review-stars')) {
        const fullStarCount = starsContainer.querySelectorAll('.fa-star').length;
        const halfStarCount = starsContainer.querySelectorAll('.fa-star-half-alt').length;
        const rating = fullStarCount + halfStarCount * 0.5;

        starsContainer.setAttribute('role', 'img');
        starsContainer.setAttribute('aria-label', labelTemplate.replace('{n}', String(rating)));
    }
}

// Refreshes all aria-labels. Called every time the language changes.
export function updateAccessibilityLabels() {
    updateMenuButtonLabel();
    updateNavigationLabel();
    updateLanguageButtonLabels();
    updateStarRatingLabels();
}

// Hides Font Awesome icons from screen readers since they are only decorative.
export function hideDecorativeIcons() {
    for (const icon of document.querySelectorAll('i.fas, i.far, i.fab')) {
        icon.setAttribute('aria-hidden', 'true');
    }
}

// Keydown handler: triggers a click when Enter or Space is pressed.
function activateOnEnterOrSpace(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
    }
}

// Makes a non-button element (e.g. a <div>) behave like a button for keyboard users:
// adds role="button", tabindex and Enter/Space activation.
export function makeKeyboardActivatable(element) {
    if (element.tagName !== 'BUTTON') {
        element.setAttribute('role', 'button');
        element.tabIndex = 0;
    }
    element.addEventListener('keydown', activateOnEnterOrSpace);
}