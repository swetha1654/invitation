# 💍 Swetha & Akshith — Wedding Invitation

A digital wedding invitation built with React, TypeScript, and Vite.

## ✨ Features

- Animated gate reveal & curtain lightbox on first visit
- Live countdown timer to the Muhurtham (6th December 2026)
- Full event timeline — Haldi, Varapooje, Sangeeth, Muhurtham, Reception
- Falling petals and ambient audio
- Fully responsive for mobile guests

## 📅 Events

| Event        | Date & Time                                                  | Venue                              |
| ------------ | ------------------------------------------------------------ | ---------------------------------- |
| 🌻 Haldi     | Sun, 29 Nov 2026 · 11 AM – 3 PM                              | The backyard, Farmhouse Collective |
| 🪔 Varapooje | Sat, 5 Dec 2026 · 11 AM                                      | Sindhoor Convention Hall, JP Nagar |
| 🎶 Sangeeth  | Sat, 5 Dec 2026 · 5 PM                                       | Sindhoor Convention Hall, JP Nagar |
| 🕉️ Muhurtham | Sun, 6 Dec 2026 · Oonjal Ceremony 6:30 AM, Muhurtham 8:44 AM | Sindhoor Convention Hall, JP Nagar |
| ✨ Reception | Sun, 6 Dec 2026 · 6 PM                                       | Sindhoor Convention Hall, JP Nagar |

## 🧱 Tech Stack

- React 19 + TypeScript
- Vite for dev server and production builds
- Plain CSS (no UI framework)
- ESLint for linting

## 📁 Project Structure

```
src/
  App.tsx              — top-level app state (gate, reveal, lightbox, modal)
  data/                — config, event list, and guest tier definitions
  components/
    hero/              — landing hero section
    events/            — event timeline, cards, and info modal
    lightbox/           — scratch/tap/curtain card reveal animations
    gate/              — entry gate overlay
  hooks/               — shared React hooks (e.g. scroll reveal)
  utils/               — audio, canvas painting, and petal animation helpers
  assets/cards/        — invitation card images
```

## 🎟️ Guest Tiers

Each guest group is given a unique hash token that decides which events they see (e.g. all events, no Haldi, core events only, or just Muhurtham + Reception). Tiers and their tokens are defined in `src/data/events.ts`.

## 🛠 Local Development

```bash
npm install
npm run dev
```

## 🚀 Deployment

Pushes to `main` automatically deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

## ✏️ Customisation

All names, dates, and venue details are in one place:

- `src/data/config.ts` — couple names, parents, wedding date, venue, hero text
- `src/data/events.ts` — event list, card messages, scratch card themes, guest tiers
