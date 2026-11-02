# QualiTrack – Pharmaceutical Quality Management Platform

## Project Overview

**QualiTrack** is a SaaS platform developed by **IoTech** to **digitize and automate pharmaceutical manufacturing quality control**.

Our solution integrates **IoT telemetry** from industrial equipment (autoclaves, pH meters, pressure sensors) with an automated **BPM compliance engine**, generating **immutable audit trails** and **PDF reports** ready for DIGEMID regulatory inspections — all in real time.

QualiTrack targets two key segments of the pharmaceutical quality ecosystem in Latin America:
- **QA Managers and Directors** at private pharmaceutical laboratories.
- **Public Health Directors** at institutions such as the INS (Instituto Nacional de Salud).

---

## Key Features

- **Real-Time IoT Monitoring:** Automated capture of temperature, pressure, and pH from industrial equipment — no manual entry, no transcription errors.
- **Automated BPM Compliance Engine:** Evaluates every sensor reading against configured GMP parameters. Blocks non-conforming batches instantly.
- **Immutable Audit Trails:** Every action is timestamped and tamper-proof. Batch traceability PDF reports generated in seconds — not days.
- **Digital Batch Management:** Full lifecycle management of production batches with digital signatures for lot release.
- **Instant Deviation Alerts:** Push notifications, email, or SMS when a critical variable goes out of range. Reaction time under 5 seconds.
- **KPI Analytics Dashboard:** Conformance rates, deviation trends, and release times — with actionable insights.
- **Internationalization (i18n):** Full support for **English (EN)** and **Spanish (ES)** via `data-i18n` attributes and a floating language switcher.

---

## Subscription Plans

| Plan | Price | Best For |
|---|---|---|
| **Standard Lab** | $199/month | Private laboratories of medium size |
| **Enterprise** | $599/month | Large institutions and public health entities (INS) |

Both plans include a **15% discount** with annual billing.

---

## Technologies Used

This Landing Page was built with standard web technologies, prioritizing performance, accessibility, and internationalization:

- **HTML5 & CSS3** — Page structure and styling with CSS custom properties for consistent branding.
- **Vanilla JavaScript** — Interactivity: language switching, accordion, plan billing toggle, scroll-reveal animations, and sticky header.
- **Font Awesome 5** — Iconography.
- **Google Fonts** — Typography (`Rubik`).
- **Flexbox / CSS Grid** — Responsive and modular layout.

---

## Project Structure

```
qualitrack-website/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # Deploys public/ to GitHub Pages on every push to main
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE.md
├── README.md
└── public/                            # Root of the published site
    ├── index.html                     # Main landing page
    ├── _header.html                   # Shared header (loaded by main.js)
    ├── _footer.html                   # Shared footer (loaded by main.js)
    ├── _language-switcher.html        # Shared floating language switcher (loaded by main.js)
    ├── assets/
    │   ├── styles/
    │   │   └── style.css              # Global stylesheet + branding variables
    │   ├── scripts/
    │   │   ├── main.js                # Shared layout, i18n engine, accordion, plans toggle, animations
    │   │   └── translations/
    │   │       ├── en.js              # English translations (En)
    │   │       └── es.js              # Spanish translations (Es)
    │   └── images/                    # Team photos, logo, section images
    └── sections/
        ├── tos.html                   # Terms of Service
        └── policies.html              # Privacy Policy (Ley N° 29733)
```

---

## Deployment

The site is published with **GitHub Pages** at [iotech-2620-8741.github.io/qualitrack-website](https://iotech-2620-8741.github.io/qualitrack-website/).

Every push to `main` runs the `Deploy to GitHub Pages` workflow (`.github/workflows/deploy.yml`), which publishes the `public/` folder as the root of the site. The workflow can also be run manually from the **Actions** tab.

---

## Version 1.0.0

First stable release of the QualiTrack Landing Page.

- Responsive landing page with hero, key features, subscription plans, and team sections.
- Full English (EN) and Spanish (ES) internationalization with a floating language switcher.
- Plan pricing with monthly/annual billing toggle (15% annual discount).
- Interactive accordion, scroll-reveal animations, and sticky header.
- Terms of Service and Privacy Policy (Ley N° 29733) pages.

---

## Team — IoTech

| Name | Code | Role |
|---|---|---|
| Baca Camargo, Vitaly Arturo | U20231c426 | Software Engineer |
| Cutiri Agüero, Fabrizio Alexander | U201914181 | Software Engineer |
| Guzmán Cabrejos, Yaku Mateo | u20231b173 | Software Engineer |
| Huapaya Galindo, Dyron | U202322855 | Software Engineer |
| Lopez Roman, Franco Mauricio | U202315890 | Software Engineer |
| Montes Ramos, Henry Jaredt | U20231D343 | Software Engineer |
| Quiroz Cáceres, Adrian | U202214864 | Software Engineer |
| Ruiz Madrid, Billy Jake | U202116401 | Software Engineer |
| Torres Apolinario, Giovany Smith | U202311601 | Software Engineer |

> Software Engineering students at **Universidad Peruana de Ciencias Aplicadas (UPC)**.

---

## Copyright

Copyright © 2026 IoTech. All rights reserved.