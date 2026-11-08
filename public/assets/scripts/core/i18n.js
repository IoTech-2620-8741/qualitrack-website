import {
    LANGUAGE_STORAGE_KEY,
    SUPPORTED_LANGUAGE_CODES,
    DEFAULT_LANGUAGE_CODE
} from '../config/constants.js';
import { state } from './state.js';
import { updateAccessibilityLabels } from '../utils/a11y.js';

const flatTranslationsCache = {};
const reportedMissingKeys = new Set();

function readSavedLanguageCode() {
    try {
        const savedLanguageCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return SUPPORTED_LANGUAGE_CODES.includes(savedLanguageCode) ? savedLanguageCode : null;
    } catch (error) {
        return null;
    }
}

function saveLanguageCode(languageCode) {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
    }
}

function detectInitialLanguageCode() {
    const savedLanguageCode = readSavedLanguageCode();
    if (savedLanguageCode) {
        return savedLanguageCode;
    }

    const browserLanguage = (navigator.language || '').toLowerCase();
    return browserLanguage.startsWith('es') ? 'es' : DEFAULT_LANGUAGE_CODE;
}

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

function getTranslationsObject(languageCode) {
    if (languageCode === 'es') {
        return typeof Es !== 'undefined' ? Es : null;
    }
    return typeof En !== 'undefined' ? En : null;
}

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

export function translate(translationKey, fallbackText) {
    const flatTranslations = getFlatTranslations(state.currentLanguageCode);
    const translatedText = flatTranslations[translationKey];
    return translatedText !== undefined ? translatedText : fallbackText;
}

function warnMissingTranslation(languageCode, translationKey) {
    const reportId = languageCode + ':' + translationKey;
    if (reportedMissingKeys.has(reportId)) {
        return;
    }
    reportedMissingKeys.add(reportId);
    console.warn('Falta la clave de traducción "' + translationKey + '" en el idioma "' + languageCode + '".');
}

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

function updateLanguageButtons(languageCode) {
    for (const button of document.querySelectorAll('.language-button')) {
        const isActive = button.dataset.lang === languageCode;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    }
}

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

export function setLanguage(languageCode) {
    if (!SUPPORTED_LANGUAGE_CODES.includes(languageCode)) {
        return;
    }
    state.currentLanguageCode = languageCode;
    saveLanguageCode(languageCode);
    applyTranslations(languageCode);
}

function onLanguageButtonClick(event) {
    setLanguage(event.currentTarget.dataset.lang);
}

export function setupLanguageSwitcher() {
    for (const button of document.querySelectorAll('.language-button')) {
        button.addEventListener('click', onLanguageButtonClick);
    }
}

export function initializeLanguage() {
    state.currentLanguageCode = detectInitialLanguageCode();
}