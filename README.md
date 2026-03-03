# ⚡ QUIVER — Setup Guide
### AI-Powered Adaptive Quiz Engine

Follow these steps **exactly in order**. Don't skip anything.

---

## WHAT YOU NEED BEFORE STARTING

- A computer with internet
- Node.js installed → download from https://nodejs.org (pick the "LTS" version)
- An Anthropic API key → get one free at https://console.anthropic.com
- A code editor (VS Code recommended → https://code.visualstudio.com)

---

## STEP 1 — Check Node.js is installed

Open your **Terminal** (Mac/Linux) or **Command Prompt** (Windows).

Type this and press Enter:
```
node --version
```

You should see something like `v20.x.x`. If you get an error, install Node.js first (link above).

---

## STEP 2 — Create the project folder

In your terminal, type these commands one by one:

```
mkdir quiver
cd quiver
```

You are now inside the `quiver` folder. **All future commands run from here.**

---

## STEP 3 — Create the file structure

Run these commands to create all the folders:

```
mkdir src
mkdir public
```

---

## STEP 4 — Create each file

Copy the content of each file below and save it exactly as described.

### FILE 1: `package.json`
Create a file named `package.json` in the `quiver` folder (NOT inside src). Paste this content:

```json
{
  "name": "quiver",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.0"
  }
}
```

---

### FILE 2: `vite.config.js`
Create a file named `vite.config.js` in the `quiver` folder. Paste this:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

### FILE 3: `index.html`
Create a file named `index.html` in the `quiver` folder. Paste this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quiver — Adaptive Quiz Engine</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### FILE 4: `.env`
Create a file named `.env` in the `quiver` folder.

⚠️ The filename starts with a dot. On Mac/Linux it will be hidden — that's normal.

Paste this and **replace the key with your real Anthropic API key**:

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
```

Get your key from: https://console.anthropic.com/keys

---

### FILE 5: `public/favicon.svg`
Create a file named `favicon.svg` inside the `public` folder. Paste this:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <rect x="1" y="1" width="38" height="38" rx="8" stroke="#f5c400" stroke-width="1.5" fill="rgba(245,196,0,0.06)"/>
  <line x1="20" y1="8" x2="20" y2="32" stroke="#f5c400" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M14 14 L20 8 L26 14" stroke="#f5c400" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M16 20 L20 32 L24 20" stroke="#f5c400" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="rgba(245,196,0,0.2)"/>
  <circle cx="20" cy="20" r="2.5" fill="#f5c400"/>
</svg>
```

---

### FILE 6: `src/main.jsx`
Create a file named `main.jsx` inside the `src` folder. Paste this:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

### FILE 7: `src/App.jsx`
This is the big one — the entire app.
Create a file named `App.jsx` inside the `src` folder.
**Download the App.jsx file provided separately and place it here.**

---

## STEP 5 — Install dependencies

In your terminal (make sure you're in the `quiver` folder), run:

```
npm install
```

Wait for it to finish. You'll see a `node_modules` folder appear. This is normal.

---

## STEP 6 — Start the app

Run:
```
npm run dev
```

You'll see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## STEP 7 — Open in browser

Open your browser and go to:
```
http://localhost:5173
```

**Quiver is now running!** 🎉

---

## YOUR FOLDER STRUCTURE

When done, it should look exactly like this:

```
quiver/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← the big file
│   └── main.jsx
├── .env                 ← your API key (never share this)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## TROUBLESHOOTING

**"npm: command not found"**
→ Node.js is not installed. Go to https://nodejs.org and install the LTS version.

**"Failed to fetch" or "401" error when generating quiz**
→ Your API key is wrong or missing. Check your `.env` file. Make sure there are no spaces around the `=`.

**"Cannot find module" errors**
→ Run `npm install` again.

**Page is blank / white**
→ Open browser DevTools (F12) → Console tab. Share the error message.

**Port 5173 already in use**
→ Run `npm run dev -- --port 3000` to use a different port.

---

## STOPPING THE APP

Press `Ctrl + C` in the terminal to stop the dev server.

To start again later: `cd quiver` then `npm run dev`

---

Built with React + Vite + Claude AI ⚡
