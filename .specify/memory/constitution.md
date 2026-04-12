<!--
Sync Impact Report
Version change: 0.0.0 → 1.0.0 (initial)
Added principles: User Experience, Simplicity, Reliability
Templates requiring updates: ✅ N/A (initial constitution)
-->

# HIIT Timer Constitution

## Core Principles

### I. User Experience

The timer MUST be usable by everyone and work flawlessly on mobile devices.

- Accessible: proper contrast, screen reader support, keyboard navigation
- Responsive: works on all screen sizes, optimized for phone use
- Clear visual and audio cues for work/rest transitions
- No unnecessary UI complexity

### II. Simplicity

Keep the codebase minimal and maintainable.

- Minimal dependencies: prefer native browser APIs
- No over-engineering: build only what's needed
- Self-contained: single-page app, no backend required
- Code should be readable without extensive documentation

### III. Reliability

The timer MUST work consistently without failures.

- Graceful error handling with user-friendly messages
- Works offline after initial load
- Timer accuracy is critical: use appropriate timing APIs
- State persists across page refreshes

## Quality Standards

- Clean, semantic HTML
- CSS with mobile-first approach
- JavaScript with proper error boundaries
- Manual testing on multiple devices before release

## Governance

This constitution guides all development decisions. When in doubt, prioritize user experience and simplicity over feature additions.

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01
