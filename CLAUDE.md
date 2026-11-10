# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser-based HIIT (High-Intensity Interval Training) workout timer. Vanilla JavaScript, no build step, static files served via nginx in Docker.

## Commands

```bash
# Docker (recommended)
docker compose up -d      # Start on http://localhost
docker compose down       # Stop
docker compose logs       # View logs
docker compose build      # Rebuild after changes

# Local development
cd src && python3 -m http.server 8000  # http://localhost:8000
```

No tests, linting, or build process configured.

## Architecture

**Source files** (`src/`):
- `index.html` - Single-page app with ARIA accessibility attributes
- `app.js` - Timer state machine, theme toggle, and localStorage persistence
- `audio.js` - Web Audio API tone generation (no external sound files)
- `theme.js` - Pre-paint theme application (loaded in `<head>`; CSP forbids inline scripts)
- `styles.css` - Mobile-first responsive CSS with light/dark themes via `data-theme` on `<html>`
- `sw.js` - Service worker: precaches app shell, stale-while-revalidate fetch strategy
- `manifest.json` - PWA manifest (standalone display, portrait)
- `icons/` - PNG icons; regenerate with `scripts/generate-icons.py` (requires Pillow)

**Timer state machine** (in `app.js`):
```
idle ──► work ──► rest ──► work ──► ... ──► complete
            ↑_______↓ (rounds loop)
any state ──[pause]──► paused ──[resume]──► previous
any state ──[reset]──► idle
```

**Audio module** (`audio.js`) exposes global functions:
- `unlockAudio()` - Required on iOS before any sound plays (call on user gesture)
- `playWorkSound()` / `playRestSound()` / `playCompleteSound()`

**localStorage keys**:
- `hiit-timer-config` stores `{workDuration, restDuration, rounds}`
- `hiit-timer-theme` stores `'light'` or `'dark'` (defaults to `prefers-color-scheme`)

## Deployment

- Docker image: `nginxinc/nginx-unprivileged:alpine-slim` (runs as uid 101) plus `apk upgrade`;
  the slim base has no curl or optional nginx modules, which is where most image CVEs came from
- `docker compose build` always pulls the current base. Rebuild periodically to pick up
  security fixes; check with `trivy image hiit-hiit-timer:latest`
- Container listens on 8080, mapped to host port 80
- Hardened runtime: read-only root filesystem (`/tmp` is a tmpfs, the only writable path),
  all capabilities dropped, `no-new-privileges`, 64-process limit. Web root and nginx config
  are root-owned, so the nginx user cannot modify them
- nginx answers only GET/HEAD (405 otherwise) and returns 404 for dotfiles
- Resource limits: 1 CPU / 512MB memory; reservations: 0.25 CPU / 64MB

**nginx configuration** (two files):
- `nginx.conf` - Main config: 2 worker processes, logging, includes conf.d
- `default.conf` - Server block: security headers (CSP, X-Frame-Options, etc.)

## Constraints

- Duration inputs: 1-600 seconds (10 min max)
- Rounds: 1-99
- Keyboard shortcuts: Space (start/pause), R (reset)
- Wake Lock API keeps screen on during workout
