import {
    LANGUAGE_STORAGE_KEY,
    SUPPORTED_LANGUAGE_CODES,
    DEFAULT_LANGUAGE_CODE
} from '../config/constants.js';
import { state } from './state.js';
import { updateAccessibilityLabels } from '../utils/a11y.js';

// Cache of flattened translations per language, so we only flatten once.
const flatTranslationsCache = {};
// Keys already reported as missing, to avoid repeating the same warning.
const reportedMissingKeys = new Set();

// Reads the saved language from localStorage. Returns null if none or invalid.
function readSavedLanguageCode() {
    try {
        const savedLanguageCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return SUPPORTED_LANGUAGE_CODES.includes(savedLanguageCode) ? savedLanguageCode : null;
    } catch (error) {
        return null;
    }
}

// Saves the chosen language to localStorage (ignores storage errors).
function saveLanguageCode(languageCode) {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
    }
}

// Picks the starting language: saved choice first, then browser language, then default.
function detectInitialLanguageCode() {
    const savedLanguageCode = readSavedLanguageCode();
    if (savedLanguageCode) {
        return savedLanguageCode;
    }

    const browserLanguage = (navigator.language || '').toLowerCase();
    return browserLanguage.startsWith('es') ? 'es' : DEFAULT_LANGUAGE_CODE;
}

// Flattens nested object: { "nav": { "home": "Inicio" } } -> { "nav.home": "Inicio" }
function flattenTranslations(nestedTranslations, parentPath = '') {
    const flatTranslations = {};

    for (const propertyName of Object.keys(nestedTranslations)) {
        const value = nestedTranslations[propertyName];
        const fullPath = parentPath ? parentPath + '.' + propertyName : propertyName;
        const isNestedObject = value !== null && typeof value === 'object' && !Array.isArray(value);

        if (isNestedObject) {
            Object.assign(flatTranslations, flattenTranslations(value, fullPath));
        } else {
            flatTranslations[fullPath] = value;
        }
    }

    return flatTranslations;
}

// Returns the global translation object (Es or En) for a language, or null if not loaded.
function getTranslationsObject(languageCode) {
    if (languageCode === 'es') {
        return typeof Es !== 'undefined' ? Es : null;
    }
    return typeof En !== 'undefined' ? En : null;
}

// Returns the flattened translations for a language (cached after the first call).
function getFlatTranslations(languageCode) {
    if (flatTranslationsCache[languageCode]) {
        return flatTranslationsCache[languageCode];
    }

    const translationsObject = getTranslationsObject(languageCode);
    if (!translationsObject) {
        console.warn('No se cargaron las traducciones del idioma "' + languageCode + '".');
        return {};
    }

    flatTranslationsCache[languageCode] = flattenTranslations(translationsObject);
    return flatTranslationsCache[languageCode];
}

// Returns the translated text for a key in the current language, or the fallback if missing.
export function translate(translationKey, fallbackText) {
    const flatTranslations = getFlatTranslations(state.currentLanguageCode);
    const translatedText = flatTranslations[translationKey];
    return translatedText !== undefined ? translatedText : fallbackText;
}

// Logs a missing translation key once per language.
function warnMissingTranslation(languageCode, translationKey) {
    const reportId = languageCode + ':' + translationKey;
    if (reportedMissingKeys.has(reportId)) {
        return;
    }
    reportedMissingKeys.add(reportId);
    console.warn('Falta la clave de traducción "' + translationKey + '" en el idioma "' + languageCode + '".');
}

// Sets an element's text. If it has child elements (e.g. a <span> inside a price <p>),
// only the first text node is updated so the inner elements are not wiped.
function setElementText(element, translatedText) {
    if (element.children.length === 0) {
        element.textContent = translatedText;
        return;
    }

    for (const childNode of element.childNodes) {
        if (childNode.nodeType === Node.TEXT_NODE) {
            childNode.nodeValue = translatedText;
            return;
        }
    }

    element.insertBefore(document.createTextNode(translatedText), element.firstChild);
}

// Applies translations to every [data-i18n] element (plain text).
function translateTextElements(flatTranslations, languageCode) {
    for (const element of document.querySelectorAll('[data-i18n]')) {
        const translationKey = element.getAttribute('data-i18n');
        const translatedText = flatTranslations[translationKey];

        if (translatedText === undefined) {
            warnMissingTranslation(languageCode, translationKey);
            continue;
        }
        setElementText(element, translatedText);
    }
}

// Translates an attribute (e.g. placeholder, content) using a key stored in another attribute.
function translateAttribute(keyAttributeName, targetAttributeName, flatTranslations, languageCode) {
    for (const element of document.querySelectorAll('[' + keyAttributeName + ']')) {
        const translationKey = element.getAttribute(keyAttributeName);
        const translatedText = flatTranslations[translationKey];

        if (translatedText === undefined) {
            warnMissingTranslation(languageCode, translationKey);
            continue;
        }
        element.setAttribute(targetAttributeName, translatedText);
    }
}

// Applies translations to every [data-i18n-html] element (text that contains HTML).
function translateHtmlElements(flatTranslations, languageCode) {
    for (const element of document.querySelectorAll('[data-i18n-html]')) {
        const translationKey = element.getAttribute('data-i18n-html');
        const translatedHtml = flatTranslations[translationKey];

        if (translatedHtml === undefined) {
            warnMissingTranslation(languageCode, translationKey);
            continue;
        }
        element.innerHTML = translatedHtml;
    }
}

// Highlights the active language button and updates its aria-pressed state.
function updateLanguageButtons(languageCode) {
    for (const button of document.querySelectorAll('.language-button')) {
        const isActive = button.dataset.lang === languageCode;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    }
}

// Translates the whole page to the given language and refreshes related UI.
export function applyTranslations(languageCode) {
    const flatTranslations = getFlatTranslations(languageCode);

    translateTextElements(flatTranslations, languageCode);
    translateAttribute('data-i18n-placeholder', 'placeholder', flatTranslations, languageCode);
    translateAttribute('data-i18n-content', 'content', flatTranslations, languageCode);
    translateHtmlElements(flatTranslations, languageCode);
    updateLanguageButtons(languageCode);

    document.documentElement.lang = languageCode;
    updateAccessibilityLabels();
}

// Changes the site language: updates state, saves the choice and re-translates the page.
export function setLanguage(languageCode) {
    if (!SUPPORTED_LANGUAGE_CODES.includes(languageCode)) {
        return;
    }
    state.currentLanguageCode = languageCode;
    saveLanguageCode(languageCode);
    applyTranslations(languageCode);
}

// Click handler for the EN/ES buttons.
function onLanguageButtonClick(event) {
    setLanguage(event.currentTarget.dataset.lang);
}

// Attaches the click handler to every language button.
export function setupLanguageSwitcher() {
    for (const button of document.querySelectorAll('.language-button')) {
        button.addEventListener('click', onLanguageButtonClick);
    }
}

// Sets the initial language in state (does not translate the page yet).
export function initializeLanguage() {
    state.currentLanguageCode = detectInitialLanguageCode();
}