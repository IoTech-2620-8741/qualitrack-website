const currentScriptUrl = import.meta.url;

export const SITE_ROOT = new URL('../../../', currentScriptUrl).href;
export const SECTIONS_ROOT = SITE_ROOT;

export const SIGN_UP_URL = 'https://qualitrack-iotech.web.app/iam/sign-up';
export const LANGUAGE_STORAGE_KEY = 'qs-lang';
export const SUPPORTED_LANGUAGE_CODES = ['en', 'es'];
export const DEFAULT_LANGUAGE_CODE = 'en';

export const PLAN_CODE_BY_CARD_TYPE = {
    standard: 'BASIC',
    enterprise: 'ENTERPRISE'
};

export const BILLING_CYCLE_CODE_BY_NAME = {
    monthly: 'MONTHLY',
    annually: 'YEARLY'
};