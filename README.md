# HIIT Timer

A zero-dependency, browser-based interval timer for HIIT (High-Intensity Interval Training) workouts. No build step, no tracking, no accounts — just open it and train.

## Features

- **Fully configurable** — set work duration, rest duration, and rounds (saved to `localStorage`)
- **Audio cues** — Web Audio API generates tones in-browser, no sound files to load
- **Screen stays on** — uses the Wake Lock API so your phone won't sleep mid-burpee
- **Accessible** — ARIA live regions, keyboard shortcuts, screen-reader friendly
- **Light & dark themes** — toggle in the top-right corner, follows system preference by default
- **Installable PWA** — on iPhone use Safari's Share → Add to Home Screen for a standalone, offline-capable app
- **Tiny** — ~740 lines total of hand-written* HTML/CSS/JS. No frameworks, no bundler

  <sub>*mostly written by Claude. Does Claude even have hands? Unclear. The lines exist, though.</sub>

## Quick start

### Docker (recommended)

```bash
docker compose up -d
# open http://localhost
```

### Local development

```bash
cd src && python3 -m http.server 8000
# open http://localhost:8000
```

## Keyboard shortcuts

| Key     | Action        |
|---------|---------------|
| `Space` | Start / pause |
| `R`     | Reset         |

## Architecture

Static files in `src/`:

- `index.html` — single-page app with ARIA attributes
- `app.js` — timer state machine (`idle → work ↔ rest → complete`), theme toggle, and `localStorage` persistence
- `audio.js` — Web Audio API tone generator with iOS unlock handling
- `theme.js` — applies the saved/system theme before first paint (no flash of wrong theme)
- `styles.css` — mobile-first responsive CSS with light/dark themes
- `sw.js` + `manifest.json` + `icons/` — PWA install and offline support

Served in production by `nginxinc/nginx-unprivileged:alpine` (uid 101) with a hardened CSP and the usual security headers. Container listens on 8080, mapped to host port 80.

## Constraints

- Work / rest: 1–600 seconds
- Rounds: 1–99

## License

MIT — see [LICENSE](LICENSE).
