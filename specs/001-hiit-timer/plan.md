# Implementation Plan: HIIT Workout Timer

**Branch**: `001-hiit-timer` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-hiit-timer/spec.md`

## Summary

Build a browser-based HIIT workout timer with configurable work/rest intervals, round counting, and audio/visual feedback. Uses vanilla HTML/CSS/JavaScript with no build tools for maximum simplicity and reliability.

## Technical Context

**Language/Version**: JavaScript ES2020+ (modern browsers)
**Primary Dependencies**: None (vanilla JS, Web Audio API, localStorage)
**Storage**: localStorage for persisting user configuration
**Testing**: Manual testing on multiple devices
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge) - mobile-first
**Project Type**: Single-page web application (static files)
**Performance Goals**: <2s load time, <100ms timer accuracy
**Constraints**: Offline-capable after initial load, touch-friendly, accessible
**Scale/Scope**: Single HTML file with linked CSS/JS, ~500 lines total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User Experience | PASS | Mobile-first, accessible, clear audio/visual cues |
| II. Simplicity | PASS | Vanilla JS, no dependencies, no build tools |
| III. Reliability | PASS | Offline support, accurate timing, state persistence |

## Project Structure

### Documentation (this feature)

```text
specs/001-hiit-timer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── index.html           # Main HTML structure
├── styles.css           # All styling (mobile-first)
├── app.js               # Timer logic and state management
└── audio.js             # Web Audio API sound generation
```

**Structure Decision**: Flat structure with 4 files. No subdirectories needed for this scope. Files can be served directly without any build step.

## Technical Approach

### Timer Implementation

- Use `requestAnimationFrame` for smooth countdown display
- Use `performance.now()` for accurate elapsed time tracking
- Store start timestamp to prevent drift over long workouts
- Handle page visibility changes (pause display updates when hidden, keep timing accurate)

### Audio Feedback

- Generate tones using Web Audio API (no external audio files needed)
- Different frequencies for work/rest/complete transitions
- Graceful degradation if audio context fails

### State Management

- Simple state object: `{ phase, timeRemaining, currentRound, config }`
- Save config to localStorage on change
- Load config from localStorage on page load

### Mobile Considerations

- Large touch targets (minimum 48x48px)
- Prevent screen sleep during workout (Wake Lock API where available)
- Large countdown display readable at arm's length

## Complexity Tracking

No violations - architecture is minimal and aligned with constitution principles.
