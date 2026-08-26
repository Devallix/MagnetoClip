# MagnetoClip Website

Official marketing website for [MagnetoClip](https://magnetoclip.app) — an advanced Windows desktop download manager built with Python + PySide6.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Landing page with hero, feature grid, interactive demo, comparison table, and FAQ |
| Download | `download.html` | Installer & portable ZIP downloads, browser extensions, SHA-256 checksums, system requirements |
| Buy | `buy.html` | Pricing plans (Personal / Pro / Enterprise), billing toggle, checkout form, license key modal |
| Documentation | `docs.html` | 13-section user manual with sticky sidebar, search, and scrollspy navigation |
| Contact | `contact.html` | Support channels, Discord/GitHub links, and contact form |

## Tech Stack

- **HTML5** — Semantic markup with meta tags for SEO
- **CSS3** — Custom properties, glassmorphism, CSS Grid, Flexbox, `clamp()` typography, `backdrop-filter`
- **JavaScript (Vanilla)** — No frameworks; modular ES5+ with IIFE patterns
- **Google Fonts** — Inter (body), Outfit (headings), JetBrains Mono (code)
- **Font Awesome 6.4** — Icon library via CDN

## Project Structure

```
magnetoclip website/
├── index.html
├── buy.html
├── contact.html
├── docs.html
├── download.html
├── css/
│   └── style.css
├── js/
│   ├── main.js          # Navbar, FAQ accordion, download simulator, toasts
│   ├── checkout.js       # Pricing logic, coupon codes, payment form, receipt generation
│   └── docs.js           # Documentation search, scrollspy, sidebar toggle, code copy
└── images/
    ├── logo.png
    ├── magneto.png
    └── product.png
```

## Features

### Design
- Dark cyber theme with cyan/violet/magenta accent palette
- Glassmorphism card components with `backdrop-filter`
- Animated hero with floating 3D product showcase and feature badges
- Gradient text effects and glowing accents

### Responsive Breakpoints
- **Desktop/Laptop** (>1017px) — Full inline navbar with CTA buttons
- **Tablet** (769px–1017px) — Collapsed docs sidebar, 2-column feature grid
- **Mobile** (≤1017px) — Hamburger menu with slide-in drawer
- **Small Mobile** (≤480px) — Reduced typography and compact layouts

### Interactive Elements
- **Download Engine Simulator** — Animated chunked progress bar with speed simulation
- **FAQ Accordion** — Expandable/collapsible Q&A items
- **Pricing Toggle** — Monthly / Annual / 2-Year billing cycle switcher
- **Checkout Form** — Card number formatting, coupon code system, serial key generation
- **Toast Notifications** — Slide-in alerts for user feedback
- **Docs Search** — Real-time filtering of documentation articles
- **Scrollspy** — Active section highlighting in documentation sidebar
- **Clipboard Copy** — One-click copy for checksums and code snippets

## Browser Support

- Chrome / Edge / Firefox / Brave / Vivaldi (latest 2 versions)
- Safari 15+
- Mobile Safari / Chrome for Android

## Local Development

No build step required. Open `index.html` in a browser or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

## License

© 2026 MagnetoClip by Devallix. All rights reserved.
