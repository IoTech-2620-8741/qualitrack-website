import {
    SIGN_UP_URL,
    PLAN_CODE_BY_CARD_TYPE,
    BILLING_CYCLE_CODE_BY_NAME
} from '../config/constants.js';

// Shows or hides a list of elements.
function setElementsVisible(elements, isVisible) {
    for (const element of elements) {
        element.style.display = isVisible ? '' : 'none';
    }
}

// Updates each plan card's button so it links to the sign-up page
// with the right plan and billing cycle in the URL.
function updatePlanLinks(billingCycleName) {
    const billingCycleCode = BILLING_CYCLE_CODE_BY_NAME[billingCycleName];

    for (const planCard of document.querySelectorAll('.plan-card')) {
        const planCode = PLAN_CODE_BY_CARD_TYPE[planCard.dataset.planType];
        const ctaLink = planCard.querySelector('a.button');
        if (!planCode || !ctaLink) continue;

        const signUpUrl = new URL(SIGN_UP_URL);
        signUpUrl.searchParams.set('plan', planCode);
        signUpUrl.searchParams.set('billingCycle', billingCycleCode);
        ctaLink.href = signUpUrl.href;

        if (ctaLink.target === '_blank') {
            ctaLink.rel = 'noopener noreferrer';
        }
    }
}

// Selects a billing cycle (monthly or annually): highlights its toggle button,
// shows the matching prices and updates the sign-up links.
function selectBillingCycle(billingCycleName) {
    for (const toggleButton of document.querySelectorAll('.toggle-button')) {
        const isSelected = toggleButton.dataset.plan === billingCycleName;
        toggleButton.classList.toggle('active', isSelected);
        toggleButton.setAttribute('aria-pressed', String(isSelected));
    }

    const isMonthly = billingCycleName === 'monthly';
    setElementsVisible(document.querySelectorAll('.monthly-price'), isMonthly);
    setElementsVisible(document.querySelectorAll('.annually-price'), !isMonthly);
    setElementsVisible(document.querySelectorAll('.annual-save'), !isMonthly);
    updatePlanLinks(billingCycleName);
}

// Click handler for the monthly/annually toggle buttons.
function onPlanToggleClick(event) {
    selectBillingCycle(event.currentTarget.dataset.plan);
}

// Sets up the billing toggle and applies the initially active cycle (monthly by default).
export function setupPlansToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-button');
    if (toggleButtons.length === 0) return;

    for (const toggleButton of toggleButtons) {
        toggleButton.addEventListener('click', onPlanToggleClick);
    }

    const activeButton = document.querySelector('.toggle-button.active');
    selectBillingCycle(activeButton ? activeButton.dataset.plan : 'monthly');
}