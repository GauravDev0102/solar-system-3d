# 🪐 3D Solar System Explorer

An interactive 3D visualization of the solar system built with **Three.js** and vanilla JavaScript — planets with NASA-style textures, motion trails, an asteroid belt, camera fly-to navigation, planet-specific ambient sounds, a top-down tactical minimap, a full search + keyboard-shortcut system, and a built-in space Q&A chatbot (offline knowledge base, no API keys).

## Run it

Textures load via `THREE.TextureLoader`, so use any static server (a plain double-click of `index.html` may block texture fetches):

```bash
npm start          # runs: npx serve .
# or
npx serve .
# or
python -m http.server 8000
```

Open http://localhost:3000 (or http://localhost:8000).

## What you can do

- **Click / double-click any planet or the Sun** — the camera flies over and an info panel opens with real planetary stats
- **Search** (`/`) by planet name, **jump with keys `1–8`**
- **On-screen controls:** orbits toggle, labels, pause/play, simulation speed slider, ambient sound, screenshot capture, fullscreen
- **Minimap** shows live top-down planet positions
- **Astro Bot chatbot** — ask "What is a black hole?", "How do rockets work?", "What is NavIC?" etc. — 250+ offline topics covering planets, stars, cosmology, rockets, satellites, missions, space agencies and future colonization (from `space_knowledge.json`, no API keys)

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Pause / resume |
| `F` | Fullscreen |
| `S` | Screenshot |
| `/` | Search planets |
| `R` | Reset camera |
| `O` / `L` | Toggle orbits / labels |
| `M` | Toggle sound |
| `1–8` | Go to planet |
| `+ / -` | Speed up / down |
| `?` | This list |

## Structure

```
index.html            # layout: HUD, info panel, minimap, chat, search
app.js                # scene init, planet/belt creation, events, render loop
js/config.js          # PLANETS data, search list, sound profiles
js/audio.js           # ambient + per-planet audio engine
js/effects.js         # glow ring + shooting stars
js/ui.js              # search, keyboard shortcuts, toast, screenshot, fullscreen
chatbot.js            # Astro Bot: offline matcher over space_knowledge.json
space_knowledge.json  # chatbot knowledge base
style.css             # UI styling
textures/             # planetary maps (Solar System Scope, CC-BY 4.0) — optimized to 1024px, ~1 MB total
```

## Deploying (GitHub Pages)

1. Push this folder as a repo (or use GitHub Desktop — it's one folder).
2. Repo **Settings → Pages → Deploy from branch → `main` / root**.
3. Your URL: `https://<user>.github.io/<repo>/` — works as-is, no build step.

## Credits

- Planet texture maps: [Solar System Scope textures](https://www.solarsystemscope.com/textures/) — CC BY 4.0
- Three.js r128 (CDN) + OrbitControls (jsdelivr examples)
