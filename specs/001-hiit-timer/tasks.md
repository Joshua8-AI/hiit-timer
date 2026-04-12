# Tasks: HIIT Workout Timer

**Input**: Design documents from `/specs/001-hiit-timer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Manual testing only (per constitution - light testing approach)

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Project initialization and file structure

- [x] T001 Create src/ directory structure
- [x] T002 [P] Create src/index.html with semantic HTML structure (header, main, controls)
- [x] T003 [P] Create src/styles.css with CSS reset and CSS custom properties for colors
- [x] T004 [P] Create src/app.js with module structure and state object skeleton
- [x] T005 [P] Create src/audio.js with Web Audio API initialization

**Checkpoint**: All files exist, app loads in browser without errors

---

## Phase 2: Foundational

**Purpose**: Core infrastructure needed by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement localStorage helper functions (save/load config) in src/app.js
- [x] T007 Implement audio tone generation (work beep, rest beep, complete sound) in src/audio.js
- [x] T008 Implement base CSS layout (mobile-first, flexbox centering) in src/styles.css
- [x] T009 Add CSS custom properties for phase colors (work=red, rest=green, idle=neutral) in src/styles.css

**Checkpoint**: Foundation ready - localStorage works, audio plays, layout renders on mobile

---

## Phase 3: User Story 1 - Configure Workout (Priority: P1) 🎯 MVP

**Goal**: User can set work duration, rest duration, and number of rounds

**Independent Test**: Enter values, refresh page, values persist

### Implementation for User Story 1

- [x] T010 [P] [US1] Add configuration input fields (work, rest, rounds) to src/index.html
- [x] T011 [P] [US1] Style configuration inputs (large touch targets, clear labels) in src/styles.css
- [x] T012 [US1] Implement input validation (1-600 seconds, 1-99 rounds) in src/app.js
- [x] T013 [US1] Implement config state management and localStorage persistence in src/app.js
- [x] T014 [US1] Load saved config on page load and populate inputs in src/app.js

**Checkpoint**: User Story 1 complete - can configure workout, settings persist across refresh

---

## Phase 4: User Story 2 - Run Workout (Priority: P1)

**Goal**: Timer counts down through work/rest intervals with audio and visual feedback

**Independent Test**: Start timer, verify countdown, phase transitions, audio cues, round counting

### Implementation for User Story 2

- [x] T015 [P] [US2] Add timer display (large countdown, phase label, round counter) to src/index.html
- [x] T016 [P] [US2] Add start button to src/index.html
- [x] T017 [P] [US2] Style timer display (large font, phase colors, round indicator) in src/styles.css
- [x] T018 [US2] Implement timer state machine (idle→work→rest→work...→complete) in src/app.js
- [x] T019 [US2] Implement countdown logic using requestAnimationFrame and performance.now() in src/app.js
- [x] T020 [US2] Implement phase transition handling (update display, play audio, advance round) in src/app.js
- [x] T021 [US2] Connect start button to timer start in src/app.js
- [x] T022 [US2] Update background/display color based on current phase in src/app.js

**Checkpoint**: User Story 2 complete - full workout runs with audio/visual feedback

---

## Phase 5: User Story 3 - Pause and Resume (Priority: P2)

**Goal**: User can pause workout and resume from same position

**Independent Test**: Start timer, pause mid-countdown, resume, verify time continues correctly

### Implementation for User Story 3

- [x] T023 [P] [US3] Add pause/resume button to src/index.html
- [x] T024 [P] [US3] Style pause/resume button (toggle state visual) in src/styles.css
- [x] T025 [US3] Implement pause state (store remaining time, stop animation frame) in src/app.js
- [x] T026 [US3] Implement resume logic (recalculate start timestamp from paused time) in src/app.js
- [x] T027 [US3] Add paused visual indicator (pulsing or dimmed display) in src/styles.css

**Checkpoint**: User Story 3 complete - pause/resume works at any point in workout

---

## Phase 6: User Story 4 - Reset Workout (Priority: P2)

**Goal**: User can reset timer to initial state while keeping configuration

**Independent Test**: Start/pause timer, press reset, verify timer returns to 0/X rounds, config unchanged

### Implementation for User Story 4

- [x] T028 [P] [US4] Add reset button to src/index.html
- [x] T029 [P] [US4] Style reset button in src/styles.css
- [x] T030 [US4] Implement reset logic (stop timer, restore initial state, keep config) in src/app.js

**Checkpoint**: User Story 4 complete - reset works from any state

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

- [x] T031 Add accessibility attributes (aria-labels, role, live regions) to src/index.html
- [x] T032 Implement Wake Lock API for screen sleep prevention in src/app.js
- [x] T033 Add keyboard shortcuts (space=start/pause, r=reset) in src/app.js
- [x] T034 Test on mobile devices and adjust touch targets if needed in src/styles.css
- [x] T035 Add meta viewport and PWA manifest link to src/index.html
- [ ] T036 Final cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase
  - US1 and US2 are both P1, but US2 depends on US1 (needs config to run)
  - US3 and US4 are P2, depend on US2 (need running timer to pause/reset)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

```
US1 (Configure) ──► US2 (Run) ──► US3 (Pause/Resume)
                           └────► US4 (Reset)
```

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T002, T003, T004, T005 can run in parallel (different files)
```

**Phase 3 (US1)**:
```
T010, T011 can run in parallel (HTML and CSS)
```

**Phase 4 (US2)**:
```
T015, T016, T017 can run in parallel (HTML and CSS)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Configure)
4. Complete Phase 4: User Story 2 (Run Timer)
5. **STOP and VALIDATE**: Timer works end-to-end
6. This is a usable MVP!

### Full Implementation

1. MVP (above)
2. Add Phase 5: User Story 3 (Pause/Resume)
3. Add Phase 6: User Story 4 (Reset)
4. Complete Phase 7: Polish

---

## Notes

- No automated tests (manual testing per constitution)
- All files are vanilla JS/CSS/HTML - no build step
- Test audio on mobile (requires user interaction first)
- Commit after each phase completion
