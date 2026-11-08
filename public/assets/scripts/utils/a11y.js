import { translate } from '../core/i18n.js';
import { state } from '../core/state.js';

function updateMenuButtonLabel() {
    const menuButton = document.getElementById('menu-button');
    if (!menuButton) return;
    const fallbackText = state.currentLanguageCode === 'es' ? 'Menú' : 'Menu';
    menuButton.setAttribute('aria-label', translate('a11y.menu', fallbackText));
}

function updateNavigationLabel() {
    const navigationBar = document.querySelector('.navigation-bar');
    if (!navigationBar) return;
    const fallbackText = state.currentLanguageCode === 'es' ? 'Navegación principal' : 'Main navigation';
    navigationBar.setAttribute('aria-label', translate('a11y.mainNav', fallbackText));
}

function updateLanguageButtonLabels() {
    for (const button of document.querySelectorAll('.language-button')) {
        const buttonLanguageCode = button.dataset.lang;
        button.setAttribute('lang', buttonLanguageCode);
        button.setAttribute('aria-label', buttonLanguageCode === 'es' ? 'Español' : 'English');
    }
}

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

export function updateAccessibilityLabels() {
    updateMenuButtonLabel();
    updateNavigationLabel();
    updateLanguageButtonLabels();
    updateStarRatingLabels();
}

export function hideDecorativeIcons() {
    for (const icon of document.querySelectorAll('i.fas, i.far, i.fab')) {
        icon.setAttribute('aria-hidden', 'true');
    }
}

function activateOnEnterOrSpace(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
    }
}

export function makeKeyboardActivatable(element) {
    if (element.tagName !== 'BUTTON') {
        element.setAttribute('role', 'button');
        element.tabIndex = 0;
    }
    element.addEventListener('keydown', activateOnEnterOrSpace);
}