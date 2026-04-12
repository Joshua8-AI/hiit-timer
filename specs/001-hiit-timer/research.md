# Research: HIIT Workout Timer

**Date**: 2026-01-01
**Branch**: `001-hiit-timer`

## Decisions

### Timer Accuracy

**Decision**: Use `requestAnimationFrame` + `performance.now()` for timing

**Rationale**:
- `setInterval` drifts over time and is throttled when tab is inactive
- `performance.now()` provides sub-millisecond precision
- Storing start timestamp and calculating elapsed time prevents cumulative drift
- `requestAnimationFrame` syncs with display refresh for smooth countdown

**Alternatives Considered**:
- `setInterval(fn, 1000)` - Rejected: drifts, throttled in background tabs
- Web Workers - Rejected: overkill for this use case, adds complexity

### Audio Generation

**Decision**: Web Audio API with generated tones (no audio files)

**Rationale**:
- No external dependencies or file loading
- Works offline immediately
- Small bundle size
- Consistent across devices

**Alternatives Considered**:
- Audio files (mp3/wav) - Rejected: adds loading time, file management
- HTML5 `<audio>` element - Rejected: less control, preloading issues

### State Persistence

**Decision**: localStorage with JSON serialization

**Rationale**:
- Built into all browsers
- Synchronous API is fine for small config object
- Persists across sessions
- No backend needed

**Alternatives Considered**:
- IndexedDB - Rejected: overkill for simple key-value config
- Cookies - Rejected: size limits, sent with requests unnecessarily

### Screen Wake Lock

**Decision**: Use Wake Lock API with fallback (no lock if unsupported)

**Rationale**:
- Prevents screen from sleeping during workout
- Progressive enhancement - works where available
- No error if unsupported, just degrades gracefully

**Alternatives Considered**:
- Video element hack - Rejected: hacky, battery drain
- No wake lock - Rejected: poor UX during workouts

## Open Questions

None - all technical decisions resolved.
