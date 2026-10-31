# Contributing to the QualiTrack Website

Thank you for contributing to the QualiTrack landing page! This document establishes the standards, project rules, and development workflow that keep the website consistent, accessible, and easy to maintain.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Git Workflow & Branching Strategy](#git-workflow--branching-strategy)
3. [Conventional Commits](#conventional-commits)
4. [Semantic Versioning (SemVer)](#semantic-versioning-semver)
5. [HTML Guidelines](#html-guidelines)
6. [CSS Guidelines](#css-guidelines)
7. [JavaScript Guidelines](#javascript-guidelines)
8. [Internationalization (i18n)](#internationalization-i18n)
9. [Development Workflow](#development-workflow)
10. [Pull Request (PR) Process](#pull-request-pr-process)

---

## Project Structure

The website is a static site built with HTML5, CSS3, and vanilla JavaScript. All the site lives under `public/`:

```text
public/
├── index.html                    # Landing page
├── _header.html                  # Shared header (loaded by main.js)
├── _footer.html                  # Shared footer (loaded by main.js)
├── _language-switcher.html       # Shared floating language switcher (loaded by main.js)
├── sections/
│   ├── tos.html                  # Terms of Service
│   └── policies.html             # Privacy Policy (Ley N° 29733)
└── assets/
    ├── images/                   # Team photos, logo, and section images
    ├── styles/
    │   └── style.css             # Global stylesheet with design tokens in :root
    └── scripts/
        ├── main.js               # Shared layout, i18n engine, menu, accordion, plans toggle, animations
        └── translations/
            ├── en.js             # English translations (En)
            └── es.js             # Spanish translations (Es)
```

- **Shared layout**: pages do not copy the header, footer, or language switcher. They declare `<div id="header-placeholder">`, `<div id="footer-placeholder">`, and `<div id="language-switcher-placeholder">`, and `main.js` replaces them with the partials. Inside the partials, `{{home}}` is the landing page and `{{root}}` is the root of the site.
- **Partials** start with an underscore (`_header.html`) to show they are fragments, not pages.

---

## Git Workflow & Branching Strategy

We follow the standard **Git Flow** branching model:

```text
main ──────────────────────────────────────────●────── (Production Releases)
         \                                    /
develop ──●─────────●───────────────●────────●──────── (Integration Branch)
           \       /                 \      /
feature/    ●─────●                   ●────●           (Feature Branches)
```

### Branch Types & Naming Conventions
- `main`: Production-ready code. Only merged from `release/*` or `hotfix/*` branches. Tagged with SemVer tags (e.g., `v1.1.0`).
- `develop`: Primary integration branch where completed features are merged.
- `feature/<short-description>`: New features, corrections, or enhancements (branched from `develop`, merged back to `develop` through a pull request).
  - *Example:* `feature/shared-header-footer`, `feature/general-design`
- `release/v<MAJOR.MINOR.PATCH>`: Release preparation, changelog, and version update (branched from `develop`, merged to `main` and `develop`).
- `hotfix/<short-description>`: Critical fixes for the published site (branched directly from `main`, merged to `main` and `develop`).

Delete the local and remote branch once its pull request is merged.

---

## Conventional Commits

Commit messages must follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification and be written in English.

### Commit Format
```text
<type>(<scope>): <short summary in imperative mood>

[optional body providing context and motivation]
```

### Commit Types
| Type       | Description                                                   |
|------------|---------------------------------------------------------------|
| `feat`     | A new section, page, or capability                            |
| `fix`      | A bug fix                                                     |
| `docs`     | Documentation changes only (README, CHANGELOG, CONTRIBUTING)  |
| `style`    | Visual or formatting changes in the stylesheet                |
| `refactor` | Restructuring code without changing its behavior              |
| `perf`     | Changes that improve loading or rendering performance         |
| `chore`    | Maintenance tasks that do not alter the website               |

### Allowed Scopes
Scopes name the area of the website that changes: `header`, `footer`, `hero`, `plans`, `team`, `layout`, `pages`, `tos`, `policies`, `i18n`, `design`, `a11y`, `images`, `readme`, `changelog`, `license`.

### Examples
- `feat(layout): load the shared header and footer from main.js`
- `fix(i18n): match footer link keys with the translations`
- `style(design): make cards and buttons consistent`
- `refactor(pages): align policies.html and tos.html id names with the naming conventions`
- `docs(changelog): add changelog with version 1.0.0`

Keep each commit small and focused on one change.

---

## Semantic Versioning (SemVer)

Versions follow the [SemVer 2.0.0](https://semver.org/) schema: `MAJOR.MINOR.PATCH`

- **MAJOR (`X.0.0`)**: A redesign or a restructuring that changes the URLs of the pages.
- **MINOR (`0.X.0`)**: New sections, pages, or capabilities that keep the existing ones working.
- **PATCH (`0.0.X`)**: Bug fixes and text corrections.

Every release records its changes in `CHANGELOG.md`, following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## HTML Guidelines

- **Semantic HTML5**: use `header`, `nav`, `section`, `footer`, and heading levels in order.
- **Naming conventions**: classes and ids use `kebab-case` with full words, without abbreviations (`button`, `navigation-bar`, `call-to-action`; not `btn`, `navbar`, `cta`).
- **Section ids** end in `-section` (`home-section`, `plans-section`), and navigation links point to them.
- **Accessibility (a11y)**:
  - Every image has a descriptive `alt` attribute.
  - Buttons that only show an icon include an `aria-label`.
  - Keep the visible keyboard focus; do not remove outlines.
- **No duplicated layout**: use the shared partials instead of copying the header, footer, or language switcher into a page.
- **Plan buttons** link to the web application with the `plan` (`BASIC` or `ENTERPRISE`) and `billingCycle` (`MONTHLY` or `YEARLY`) query parameters, which the web application reads to preselect the plan.

---

## CSS Guidelines

- **Single stylesheet**: all styles live in `public/assets/styles/style.css`, grouped by section with a comment heading.
- **Design tokens**: use the custom properties declared in `:root` for colors (`--primary-color`, `--text-body`, `--border-color`), font sizes (`--fs-h2`, `--fs-body`), radii, and shadows. Do not add hardcoded colors; add a token when a new one is needed.
- **Units**: use `rem` (the root font size is `62.5%`, so `1rem = 10px`).
- **Responsive design**: extend the existing breakpoints (`1200px`, `991px`, `768px`, `450px`) instead of creating new ones, and check the site at 375px wide.
- **Motion**: new animations must respect `prefers-reduced-motion`.

---

## JavaScript Guidelines

- **Vanilla JavaScript only**: no frameworks or build tools.
- **Single entry point**: page behavior goes in `public/assets/scripts/main.js`, inside `initPage()` when it needs the shared header or footer.
- **Naming conventions**:
  - `camelCase`: variables and functions (`currentLang`, `applyTranslations`).
  - `UPPER_SNAKE_CASE`: global constants (`SITE_ROOT`).
  - `PascalCase`: global translation objects (`En`, `Es`).
- **Full words**: avoid abbreviations in names (`menuButton`, not `menuBtn`).

---

## Internationalization (i18n)

- Do not leave visible text without a translation key. Mark it with `data-i18n="section.key"` (or `data-i18n-placeholder` / `data-i18n-html`).
- Add every key to **both** `translations/en.js` and `translations/es.js`, with the same path in each file.
- Keys use `camelCase` and are grouped by section (`plans.standard.price.monthlyUnit`, `footer.product.features`).
- English is the default language; the text written in the HTML must match the English translation.
- After adding or renaming keys, switch between EN and ES and confirm that no text stays untranslated.

---

## Development Workflow

### Prerequisites
- A modern web browser.
- A local static server, because `main.js` loads the shared partials with `fetch` (opening the files directly with `file://` does not load them).

### Running the Website Locally
From the root of the repository, start a static server and open `http://localhost:5500/public/index.html`:

```bash
# Python 3
python -m http.server 5500

# or Node.js
npx http-server -p 5500
```

The VS Code **Live Server** extension also works.

### Manual Checks
- Desktop and mobile widths (at least 1280px and 375px).
- English and Spanish.
- Mobile menu, features accordion, monthly/annual plans toggle, and language switcher.
- Terms of Service and Privacy Policy pages.
- No errors in the browser console.

---

## Pull Request (PR) Process

Before submitting a pull request, verify that:
1. [ ] The branch was created from `develop` and the PR targets `develop` (or `main` for hotfixes).
2. [ ] All commit messages follow Conventional Commits.
3. [ ] The changes follow the HTML, CSS, and JavaScript naming conventions.
4. [ ] Every new or renamed text has its key in both `en.js` and `es.js`.
5. [ ] The manual checks above pass on desktop and mobile.
6. [ ] The README and CHANGELOG are updated when the change affects them.
7. [ ] If the change touches another member's area, they were told before the PR.
