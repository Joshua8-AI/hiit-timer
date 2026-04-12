# Data Model: HIIT Workout Timer

**Date**: 2026-01-01
**Branch**: `001-hiit-timer`

## Entities

### WorkoutConfig

User's workout configuration, persisted to localStorage.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| workDuration | number | 1-600 (seconds) | Duration of work intervals |
| restDuration | number | 1-600 (seconds) | Duration of rest intervals |
| rounds | number | 1-99 | Total number of rounds |

**Validation Rules**:
- All fields must be positive integers
- Durations capped at 600 seconds (10 minutes)
- Rounds capped at 99

**Default Values**:
- workDuration: 30
- restDuration: 10
- rounds: 8

### TimerState

Runtime state of the timer (not persisted).

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| phase | enum | 'idle', 'work', 'rest', 'paused', 'complete' | Current timer phase |
| timeRemaining | number | 0+ (milliseconds) | Time left in current interval |
| currentRound | number | 0 to config.rounds | Current round number (0 = not started) |
| startTimestamp | number | null or timestamp | When current interval started |
| pausedAt | number | null or milliseconds | Time remaining when paused |

**State Transitions**:

```
idle ──[start]──► work
work ──[timer ends]──► rest
rest ──[timer ends]──► work (if rounds remain)
rest ──[timer ends]──► complete (if final round)
work/rest ──[pause]──► paused
paused ──[resume]──► work/rest (previous phase)
any ──[reset]──► idle
```

## localStorage Schema

**Key**: `hiit-timer-config`
**Value**: JSON string of WorkoutConfig

```json
{
  "workDuration": 30,
  "restDuration": 10,
  "rounds": 8
}
```
