// Absolute URL of this module, used to compute the site root below.
const currentScriptUrl = import.meta.url;

// Root of the site, resolved relative to this file's location so shared
// partials and links work from index.html and from pages in /sections.
export const SITE_ROOT = new URL('../../../', currentScriptUrl).href;
export const SECTIONS_ROOT = SITE_ROOT;

// External sign-up page used by the plan CTA buttons.
export const SIGN_UP_URL = 'https://qualitrack-iotech.web.app/iam/sign-up';

// localStorage key where the chosen language is saved.
export const LANGUAGE_STORAGE_KEY = 'qs-lang';
export const SUPPORTED_LANGUAGE_CODES = ['en', 'es'];
export const DEFAULT_LANGUAGE_CODE = 'en';

// Maps a plan card type (data-plan-type) to the plan code the sign-up page expects.
export const PLAN_CODE_BY_CARD_TYPE = {
    standard: 'BASIC',
    enterprise: 'ENTERPRISE'
};

// Maps the toggle button name (data-plan) to the billing cycle code.
export const BILLING_CYCLE_CODE_BY_NAME = {
    monthly: 'MONTHLY',
    annually: 'YEARLY'
};