# 💍 Swetha & Akshith — Wedding Invitation

A digital wedding invitation built with React, TypeScript, and Vite, deployed on GitHub Pages.

## 🔗 Live Invitation

**[swetha1654.github.io/invitation](https://swetha1654.github.io/invitation/)**

Share this link with your guests to view the invitation.

---

## ✨ Features

- Animated gate reveal & curtain lightbox on first visit
- Live countdown timer to the Muhurtham (6th December 2026)
- Full event timeline — Haldi, Varapooje, Sangeeth, Muhurtham, Reception
- Falling petals and ambient audio
- Fully responsive for mobile guests

## 📅 Events

| Event | Date & Time | Venue |
|---|---|---|
| 🌻 Haldi | Sun, 29 Nov 2026 · 11 AM – 3 PM | Farmhouse Collective |
| 🪔 Varapooje | Sat, 5 Dec 2026 · 11 AM | Sindhoor Convention Hall, JP Nagar |
| 🎶 Sangeeth | Sat, 5 Dec 2026 · 6 PM | Sindhoor Convention Hall, JP Nagar |
| 🕉️ Muhurtham | Sun, 6 Dec 2026 · 6 AM | Sindhoor Convention Hall, JP Nagar |
| ✨ Reception | Sun, 6 Dec 2026 · 6 PM | Sindhoor Convention Hall, JP Nagar |

---

## 🛠 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/invitation/](http://localhost:5173/invitation/) in your browser.

## 🚀 Deployment

Pushes to `main` automatically deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

## ✏️ Customisation

All names, dates, and venue details are in one place:

- **`src/data/config.ts`** — couple names, parents, wedding date, venue, hero text
- **`src/data/events.ts`** — event list, card messages, scratch card themes

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
