# MagnetoClip Website

Official marketing website for [MagnetoClip](https://magnetoclip.vercel.app/) — an advanced Windows desktop download manager built with Python + PySide6.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Landing page with hero, feature grid, interactive demo, comparison table, and FAQ |
| Download | `download.html` | Installer & portable ZIP downloads, browser extensions, SHA-256 checksums, system requirements |
| Buy | `buy.html` | Pricing plans (Personal / Pro / Enterprise), billing toggle, checkout form, license key modal |
| Confirmation | `confirmation.html` | Post-payment order review and license key request |
| Documentation | `docs.html` | 13-section user manual with sticky sidebar, search, and scrollspy navigation |
| Contact | `contact.html` | Support channels, Discord/GitHub links, and contact form |

## Tech Stack

- **HTML5** — Semantic markup with meta tags for SEO
- **CSS3** — Custom properties, glassmorphism, CSS Grid, Flexbox, `clamp()` typography, `backdrop-filter`
- **JavaScript (Vanilla)** — No frameworks; modular ES5+ with IIFE patterns
- **Vercel Serverless Functions (Node.js)** — Paystack transaction verification, EmailJS license email, Splitforms contact proxy
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
├── confirmation.html
├── css/
│   └── style.css
├── js/
│   ├── config.js        # Client-safe config (Paystack public key, site base URL)
│   ├── main.js          # Navbar, FAQ accordion, download simulator, toasts
│   ├── checkout.js      # Pricing logic, coupon codes, Paystack checkout, server verification
│   ├── confirmation.js  # Order confirmation + license key request via /api
│   ├── contact.js       # Contact form submitter via /api/contact
│   └── docs.js          # Documentation search, scrollspy, sidebar toggle, code copy
├── api/                 # Vercel serverless functions (secrets read from env vars)
│   ├── verify-payment.js    # Paystack transaction verification (secret key)
│   ├── request-license.js   # Verify + send license email via EmailJS REST (private key)
│   └── contact.js           # Contact form proxy → Splitforms (access key)
├── images/
│   ├── logo.png
│   ├── magneto.png
│   ├── product.png
│   └── paystack.png
├── package.json
├── .env.example
└── .gitignore
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

No build step required. For the interactive checkout/contact features you need
the Vercel API functions running:

```bash
# Option 1: Vercel dev (static files + /api functions, needs `vercel` CLI)
npm install -g vercel     # if not already installed
cp .env.example .env      # then fill in your real keys for local testing
vercel dev

# Option 2: plain static server (pages only, API features will not work)
python -m http.server 8000
# or
npx serve .
```

## Environment Variables (Vercel)

Set these in **Vercel → Project → Settings → Environment Variables** (never in
committed files). Template in `.env.example`.

| Variable | Used by | Notes |
|----------|---------|-------|
| `PAYSTACK_PUBLIC_KEY` | Browser checkout | Public by design; loaded client-side |
| `PAYSTACK_SECRET_KEY` | `/api/verify-payment`, `/api/request-license` | Server-side only |
| `EMAILJS_SERVICE_ID` | `/api/request-license` | |
| `EMAILJS_TEMPLATE_ID` | `/api/request-license` | |
| `EMAILJS_PUBLIC_KEY` | `/api/request-license` | REST `user_id` |
| `EMAILJS_PRIVATE_KEY` | `/api/request-license` | Access token; server-side only |
| `SPLITFORMS_ACCESS_KEY` | `/api/contact` | Server-side proxy |
| `SITE_BASE_URL` | Client redirects, email image URLs | `https://magnetoclip.vercel.app/` |
| `ADMIN_EMAIL` | `/api/request-license` | License email recipient |

> **EmailJS dashboard step:** enable **"Allow EmailJS API for non-browser
> applications"** under Account → Security for the server-side REST calls.

## License

© 2026 MagnetoClip by Devallix. All rights reserved.
