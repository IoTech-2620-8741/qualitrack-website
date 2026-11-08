import { makeKeyboardActivatable } from '../utils/a11y.js';

function setAccordionItemOpen(accordionItem, isOpen) {
    accordionItem.classList.toggle('active', isOpen);
    const title = accordionItem.querySelector('.accordion-title');
    if (title) {
        title.setAttribute('aria-expanded', String(isOpen));
    }
}

function onAccordionTitleClick(event) {
    const clickedItem = event.currentTarget.closest('.accordion-item');
    const wasOpen = clickedItem.classList.contains('active');

    for (const accordionItem of document.querySelectorAll('.accordion-item')) {
        setAccordionItemOpen(accordionItem, false);
    }

    if (!wasOpen) {
        setAccordionItemOpen(clickedItem, true);
    }
}

export function setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length === 0) return;

    for (let index = 0; index < accordionItems.length; index++) {
        const accordionItem = accordionItems[index];
        const title = accordionItem.querySelector('.accordion-title');
        const content = accordionItem.querySelector('.accordion-content');
        if (!title) continue;

        if (content) {
            if (!content.id) {
                content.id = 'accordion-panel-' + (index + 1);
            }
            title.setAttribute('aria-controls', content.id);
        }

        title.addEventListener('click', onAccordionTitleClick);
        makeKeyboardActivatable(title);
        setAccordionItemOpen(accordionItem, false);
    }

    setAccordionItemOpen(accordionItems[0], true);
}