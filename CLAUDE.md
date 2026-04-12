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
- `app.js` - Timer state machine and localStorage persistence
- `audio.js` - Web Audio API tone generation (no external sound files)
- `styles.css` - Mobile-first responsive CSS

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

**localStorage key**: `hiit-timer-config` stores `{workDuration, restDuration, rounds}`

## Deployment

- Docker image: `nginxinc/nginx-unprivileged:alpine` (runs as uid 101)
- Container listens on 8080, mapped to host port 80
- Resource limits: 1 CPU / 512MB memory; reservations: 0.25 CPU / 64MB

**nginx configuration** (two files):
- `nginx.conf` - Main config: 2 worker processes, logging, includes conf.d
- `default.conf` - Server block: security headers (CSP, X-Frame-Options, etc.)

## Constraints

- Duration inputs: 1-600 seconds (10 min max)
- Rounds: 1-99
- Keyboard shortcuts: Space (start/pause), R (reset)
- Wake Lock API keeps screen on during workout
