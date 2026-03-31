# KWT News — Kuwait & World News 📰

> Real-time breaking news from Kuwait and around the world.
> Live at **[kwtnews.com](https://kwtnews.com)**

---

## Overview

KWT News is a Progressive Web App (PWA) delivering real-time Kuwait and international news. It is built as a single-file React app hosted on GitHub Pages with a custom domain.

**Key features:**
- Live news feed powered by Firebase Firestore
- Breaking news push notifications
- Multi-language support (English, Arabic, Urdu, Hindi, and more via Google Translate)
- Dark / Light mode
- Fully installable PWA — works offline
- Mobile-first responsive design

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (CDN, no build step) |
| Styling | Tailwind CSS (CDN) |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Authentication |
| i18n | i18next + react-i18next |
| Hosting | GitHub Pages + CNAME (`kwtnews.com`) |
| PWA | Web App Manifest + Service Worker |

---

## PWA — Install on Your Device

### Android (Chrome / Edge)
1. Open [kwtnews.com](https://kwtnews.com) in Chrome or Edge.
2. An **"Add to Home Screen"** popup appears after 0.5 seconds — tap **Install**.
3. Or open the browser menu → **Add to Home Screen**.

### iOS (Safari)
1. Open [kwtnews.com](https://kwtnews.com) in Safari.
2. Tap the **Share** icon (□↑) at the bottom.
3. Tap **"Add to Home Screen"** → **Add**.

---

## Project Structure

```
Kuwait-news/
├── index.html            # Full React app (single file)
├── manifest.json         # PWA manifest
├── sw.js                 # Service Worker (offline support)
├── offline.html          # Offline fallback page
├── robots.txt            # SEO — allow all crawlers
├── icon.svg              # Vector app icon (Kuwait Towers + WiFi + Globe)
├── icon-192.png          # App icon 192×192 (notifications, PWA)
├── icon-512.png          # App icon 512×512 (splash screen)
├── apple-touch-icon.png  # iOS home screen icon
├── favicon.svg           # Browser tab icon (SVG)
├── favicon.png           # Browser tab icon (PNG fallback)
└── CNAME                 # Custom domain → kwtnews.com
```

---

## Development

No build tools required. Edit `index.html` and push — GitHub Pages deploys automatically.

```bash
git clone https://github.com/SQLRIZWAN/Kuwait-news.git
cd Kuwait-news
# Open index.html in a browser or serve locally:
npx serve .
```

---

## Social & Contact

| Platform | Handle |
|----------|---------|
| Twitter/X | [@kwtnews_com](https://twitter.com/kwtnews_com) |
| Instagram | [@kwtnews_com](https://instagram.com/kwtnews_com) |
| YouTube | [@kwtnews_com](https://youtube.com/@kwtnews_com) |
| TikTok | [@kwtnews.com](https://tiktok.com/@kwtnews.com) |
| Telegram | [kwtnews_com](https://t.me/kwtnews_com) |
| Email | kwtnews.com@gmail.com |

---

© 2026 [kwtnews.com](https://kwtnews.com)
