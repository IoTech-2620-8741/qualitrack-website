# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-15

### Added

- IoT Devices section with the Environment Monitor, the Container Monitor and the LED status indicators (normal, warning and critical), linked from the header.
- Device toggle to switch between the two monitors on mobile.
- Product video in the features section and video in the About Us section.
- Menu overlay on mobile that closes the menu when tapped outside it.
- Keyboard support for the accordion and accessible labels for the navigation and language buttons.

### Changed

- Scripts: `main.js` was split into ES modules under `config/`, `core/`, `ui/` and `utils/`, and every page loads it with `type="module"`.
- Design: the site applies the QualiTrack style guide, and the header and hero match the web application.
- Team member photos were updated.
- README and CONTRIBUTING describe the modular scripts structure.

### Fixed

- The page fits the smallest phones.
- The shared layout and the team member images load correctly.

## [1.1.0] - 2026-11-07

### Added

- LICENSE.md with the MIT License.
- CHANGELOG.md to record the changes of each version.
- Language switcher and English and Spanish translations in the Privacy Policy page.
- GitHub Actions workflow that deploys `public/` to GitHub Pages on every push to `main`.

### Changed

- Internationalization: English is now the default language of the landing page, and the legal pages declare English as their language.
- Internationalization: the translation objects and their keys were renamed to clearer names.
- Footer: the Terms of Service and Privacy Policy links now open in the same tab.
- Deployment: the site is served from the root URL, and the legal pages moved from `/public/sections/` to `/sections/`.
- README and CONTRIBUTING describe the current project structure and the deployment.

## [1.0.0] - 2026-10-08

### Added

- Responsive landing page with hero, key features, benefits, about us, subscription plans, team and testimonials sections.
- English and Spanish internationalization with a floating language switcher.
- Plan pricing with a monthly/annual billing toggle (15% annual discount).
- Interactive accordion, scroll-reveal animations and sticky header.
- Terms of Service and Privacy Policy (Ley N° 29733) pages.
- Team member profiles, including Adrian Quiroz Cáceres.

### Fixed

- Sign-up, demo request and plan links now point to the deployed web application.
- Copyright, README, Terms of Service and Privacy Policy now name IoTech instead of ClosedSource.
- The YouTube embeds were removed from the features and about us sections.

[Unreleased]: https://github.com/IoTech-2620-8741/qualitrack-website/compare/v2.0.0...develop
[2.0.0]: https://github.com/IoTech-2620-8741/qualitrack-website/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/IoTech-2620-8741/qualitrack-website/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/IoTech-2620-8741/qualitrack-website/releases/tag/v1.0.0
