import { SITE_ROOT, SECTIONS_ROOT } from '../config/constants.js';

// Returns the URL of index.html.
export function getHomePageUrl() {
    return new URL('index.html', SITE_ROOT);
}

// Returns true when the current page is the home page.
export function isHomePage() {
    const rootPath = new URL(SITE_ROOT).pathname;
    const homePath = getHomePageUrl().pathname;
    return location.pathname === rootPath || location.pathname === homePath;
}

// Replaces {{home}} and {{root}} placeholders in a partial's HTML.
// {{home}} is empty on the home page so links stay as plain "#section" anchors.
export function fillPartialTemplate(partialHtml) {
    const homeValue = isHomePage() ? '' : getHomePageUrl().href;
    return partialHtml
        .replace(/\{\{home\}\}/g, homeValue)
        .replace(/\{\{root\}\}/g, SITE_ROOT);
}

// Downloads a partial file (e.g. _header.html) and returns its text.
// Throws an error if the request fails.
export async function fetchPartial(fileName) {
    const url = SECTIONS_ROOT + fileName;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(url + ' no se pudo cargar (HTTP ' + response.status + ')');
    }
    return response.text();
}

// Loads a partial and replaces the placeholder element with it.
// If the placeholder has data-solid, the header starts with the "scrolled" style.
export async function loadPartial(placeholderId, fileName) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        return;
    }

    try {
        const partialHtml = await fetchPartial(fileName);
        const template = document.createElement('template');
        template.innerHTML = fillPartialTemplate(partialHtml);

        if (placeholder.hasAttribute('data-solid')) {
            const partialRootElement = template.content.firstElementChild;
            partialRootElement.classList.add('scrolled');
            partialRootElement.dataset.solid = 'true';
        }

        placeholder.replaceWith(template.content);
    } catch (error) {
        console.warn('No se cargó una parte compartida del sitio:', error);
    }
}