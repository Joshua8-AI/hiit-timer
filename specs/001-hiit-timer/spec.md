# Feature Specification: HIIT Workout Timer

**Feature Branch**: `001-hiit-timer`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "HIIT workout timer with custom intervals, basic controls, audio and visual feedback"

## User Scenarios & Testing

### User Story 1 - Configure Workout (Priority: P1)

A user opens the timer and sets up their workout by entering work duration, rest duration, and number of rounds before starting.

**Why this priority**: Without configuration, users cannot customize their workout to their fitness level and goals. This is the foundation of the entire feature.

**Independent Test**: Can be fully tested by entering different time values and round counts, verifying they are saved and displayed correctly.

**Acceptance Scenarios**:

1. **Given** the timer is idle, **When** user enters 30 seconds work time, **Then** the work duration displays "0:30"
2. **Given** the timer is idle, **When** user enters 10 seconds rest time, **Then** the rest duration displays "0:10"
3. **Given** the timer is idle, **When** user sets 8 rounds, **Then** the round counter shows "0/8"
4. **Given** the timer is idle, **When** user enters 0 or negative values, **Then** the input is rejected with a visual indicator

---

### User Story 2 - Run Workout (Priority: P1)

A user starts the timer and it counts down through all work/rest intervals, providing clear visual and audio feedback for each phase.

**Why this priority**: The core timer functionality is essential - without it, the app has no value.

**Independent Test**: Start a workout with configured intervals and verify countdown progresses correctly through all phases.

**Acceptance Scenarios**:

1. **Given** a configured workout, **When** user presses start, **Then** the work phase countdown begins
2. **Given** work phase is counting down, **When** timer reaches 0, **Then** an audio cue plays and rest phase begins
3. **Given** rest phase is counting down, **When** timer reaches 0, **Then** an audio cue plays and next round begins
4. **Given** the final rest phase ends, **When** timer reaches 0, **Then** a completion sound plays and workout ends
5. **Given** a workout is running, **When** viewing the display, **Then** current phase (WORK/REST), time remaining, and round number are clearly visible
6. **Given** work phase is active, **When** viewing the display, **Then** the background/display uses a distinct "active" color
7. **Given** rest phase is active, **When** viewing the display, **Then** the background/display uses a distinct "rest" color

---

### User Story 3 - Pause and Resume (Priority: P2)

A user can pause the timer mid-workout and resume from where they left off.

**Why this priority**: Users may need to pause for interruptions. Important but workout can function without it.

**Independent Test**: Start a workout, pause at any point, verify time is frozen, resume and verify countdown continues.

**Acceptance Scenarios**:

1. **Given** a workout is running, **When** user presses pause, **Then** the countdown freezes at current time
2. **Given** a workout is paused, **When** user presses resume, **Then** the countdown continues from paused time
3. **Given** a workout is paused, **When** viewing the display, **Then** it's clear the workout is paused (not stopped)

---

### User Story 4 - Reset Workout (Priority: P2)

A user can reset the timer to start over with the same configuration.

**Why this priority**: Allows users to restart without reconfiguring. Convenient but not essential for core functionality.

**Independent Test**: Start a workout, reset at any point, verify timer returns to initial state with same configuration.

**Acceptance Scenarios**:

1. **Given** a workout is running or paused, **When** user presses reset, **Then** the timer returns to initial state
2. **Given** timer is reset, **When** viewing the configuration, **Then** previous work/rest/rounds settings are preserved

---

### Edge Cases

- What happens when the browser tab loses focus? Timer continues running
- What happens if device goes to sleep? Timer may pause; clear indication when user returns
- What happens with very long intervals (e.g., 10 minutes)? Supported up to 10 minute maximum
- What happens if audio cannot play? Visual feedback alone is sufficient; no error shown

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow users to set work interval duration (1 second to 10 minutes)
- **FR-002**: System MUST allow users to set rest interval duration (1 second to 10 minutes)
- **FR-003**: System MUST allow users to set number of rounds (1 to 99)
- **FR-004**: System MUST display a large, readable countdown timer
- **FR-005**: System MUST play distinct audio cues for work-to-rest, rest-to-work, and workout-complete transitions
- **FR-006**: System MUST visually differentiate work phase from rest phase (distinct colors)
- **FR-007**: System MUST display current round number and total rounds
- **FR-008**: System MUST provide start, pause/resume, and reset controls
- **FR-009**: System MUST persist user's last configuration across browser sessions
- **FR-010**: System MUST work on mobile devices with touch-friendly controls

### Key Entities

- **Workout Configuration**: Work duration, rest duration, number of rounds
- **Timer State**: Current phase (work/rest/idle/complete), time remaining, current round
- **User Preferences**: Last used configuration (persisted locally)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can configure and start a workout in under 30 seconds
- **SC-002**: Timer countdown is accurate within 100ms over a 30-minute workout
- **SC-003**: Phase transition audio plays immediately (no perceptible delay)
- **SC-004**: Timer display is readable from arm's length on mobile devices
- **SC-005**: App loads and is interactive within 2 seconds on 3G connection
- **SC-006**: 100% of core functionality works without network connection after initial load

## Assumptions

- Users have a modern browser with Web Audio API support
- Audio playback is allowed by the browser (user may need to interact first)
- localStorage is available for persisting configuration
- Users primarily access on mobile devices during workouts
