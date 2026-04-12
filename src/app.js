// HIIT Timer Application

// ============================================================================
// State
// ============================================================================

const state = {
  phase: 'idle', // 'idle' | 'work' | 'rest' | 'paused' | 'complete'
  previousPhase: null, // used when pausing
  timeRemaining: 0, // milliseconds
  currentRound: 0,
  config: {
    workDuration: 30,
    restDuration: 10,
    rounds: 8
  },
  startTimestamp: null,
  pausedAt: null,
  animationFrameId: null
};

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
  app: document.querySelector('.app'),
  workInput: document.getElementById('work-duration'),
  restInput: document.getElementById('rest-duration'),
  roundsInput: document.getElementById('rounds'),
  phaseLabel: document.getElementById('phase-label'),
  countdown: document.getElementById('countdown'),
  roundCounter: document.getElementById('round-counter'),
  timerDisplay: document.getElementById('timer-display'),
  startBtn: document.getElementById('start-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  resetBtn: document.getElementById('reset-btn')
};

// ============================================================================
// LocalStorage
// ============================================================================

const STORAGE_KEY = 'hiit-timer-config';

function saveConfig() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
  } catch (e) {
    console.warn('Could not save config to localStorage:', e);
  }
}

function loadConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state.config = {
        workDuration: validateDuration(parsed.workDuration, 30),
        restDuration: validateDuration(parsed.restDuration, 10),
        rounds: validateRounds(parsed.rounds, 8)
      };
    }
  } catch (e) {
    console.warn('Could not load config from localStorage:', e);
  }
}

// ============================================================================
// Validation
// ============================================================================

function validateDuration(value, defaultValue) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1 || num > 600) {
    return defaultValue;
  }
  return num;
}

function validateRounds(value, defaultValue) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1 || num > 99) {
    return defaultValue;
  }
  return num;
}

// ============================================================================
// Display Updates
// ============================================================================

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  // Update countdown
  elements.countdown.textContent = formatTime(state.timeRemaining);

  // Update round counter
  elements.roundCounter.textContent = `${state.currentRound} / ${state.config.rounds}`;

  // Update phase label and styling
  elements.timerDisplay.className = 'timer-display';

  switch (state.phase) {
    case 'idle':
      elements.phaseLabel.textContent = 'READY';
      break;
    case 'work':
      elements.phaseLabel.textContent = 'WORK';
      elements.timerDisplay.classList.add('phase-work');
      break;
    case 'rest':
      elements.phaseLabel.textContent = 'REST';
      elements.timerDisplay.classList.add('phase-rest');
      break;
    case 'paused':
      elements.phaseLabel.textContent = 'PAUSED';
      elements.timerDisplay.classList.add('phase-paused');
      if (state.previousPhase === 'work') {
        elements.timerDisplay.classList.add('phase-work');
      } else if (state.previousPhase === 'rest') {
        elements.timerDisplay.classList.add('phase-rest');
      }
      break;
    case 'complete':
      elements.phaseLabel.textContent = 'COMPLETE';
      elements.timerDisplay.classList.add('phase-complete');
      break;
  }
}

function updateButtons() {
  const isRunning = state.phase === 'work' || state.phase === 'rest';
  const isPaused = state.phase === 'paused';
  const isIdle = state.phase === 'idle';
  const isComplete = state.phase === 'complete';

  elements.startBtn.disabled = isRunning || isPaused;
  elements.startBtn.textContent = isComplete ? 'Restart' : 'Start';

  elements.pauseBtn.disabled = !isRunning && !isPaused;
  elements.pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';

  elements.resetBtn.disabled = isIdle;

  // Toggle running class on app
  if (isRunning || isPaused) {
    elements.app.classList.add('running');
  } else {
    elements.app.classList.remove('running');
  }
}

function syncInputsFromConfig() {
  elements.workInput.value = state.config.workDuration;
  elements.restInput.value = state.config.restDuration;
  elements.roundsInput.value = state.config.rounds;
  elements.roundCounter.textContent = `0 / ${state.config.rounds}`;
}

function syncConfigFromInputs() {
  state.config.workDuration = validateDuration(elements.workInput.value, state.config.workDuration);
  state.config.restDuration = validateDuration(elements.restInput.value, state.config.restDuration);
  state.config.rounds = validateRounds(elements.roundsInput.value, state.config.rounds);

  // Update inputs to show validated values
  syncInputsFromConfig();
  saveConfig();
}

// ============================================================================
// Timer Logic
// ============================================================================

async function startTimer() {
  if (state.phase === 'complete') {
    resetTimer();
  }

  syncConfigFromInputs();

  // Unlock audio on iOS (must happen during user gesture)
  await unlockAudio();

  state.currentRound = 1;
  state.phase = 'work';
  state.timeRemaining = state.config.workDuration * 1000;
  state.startTimestamp = performance.now();

  playWorkSound();
  updateDisplay();
  updateButtons();
  requestWakeLock();

  tick();
}

function tick() {
  if (state.phase !== 'work' && state.phase !== 'rest') {
    return;
  }

  const elapsed = performance.now() - state.startTimestamp;
  const initialTime = state.phase === 'work'
    ? state.config.workDuration * 1000
    : state.config.restDuration * 1000;

  state.timeRemaining = Math.max(0, initialTime - elapsed);

  if (state.timeRemaining <= 0) {
    handlePhaseComplete();
  } else {
    updateDisplay();
    state.animationFrameId = requestAnimationFrame(tick);
  }
}

function handlePhaseComplete() {
  if (state.phase === 'work') {
    // Work complete, start rest
    state.phase = 'rest';
    state.timeRemaining = state.config.restDuration * 1000;
    state.startTimestamp = performance.now();
    playRestSound();
  } else if (state.phase === 'rest') {
    // Rest complete
    if (state.currentRound >= state.config.rounds) {
      // Workout complete
      state.phase = 'complete';
      state.timeRemaining = 0;
      playCompleteSound();
      releaseWakeLock();
    } else {
      // Start next round
      state.currentRound++;
      state.phase = 'work';
      state.timeRemaining = state.config.workDuration * 1000;
      state.startTimestamp = performance.now();
      playWorkSound();
    }
  }

  updateDisplay();
  updateButtons();

  if (state.phase === 'work' || state.phase === 'rest') {
    state.animationFrameId = requestAnimationFrame(tick);
  }
}

function pauseTimer() {
  if (state.phase === 'paused') {
    // Resume
    state.phase = state.previousPhase;
    state.previousPhase = null;

    // Recalculate start timestamp based on remaining time
    const initialTime = state.phase === 'work'
      ? state.config.workDuration * 1000
      : state.config.restDuration * 1000;
    state.startTimestamp = performance.now() - (initialTime - state.pausedAt);
    state.pausedAt = null;

    updateDisplay();
    updateButtons();
    tick();
  } else if (state.phase === 'work' || state.phase === 'rest') {
    // Pause
    cancelAnimationFrame(state.animationFrameId);
    state.previousPhase = state.phase;
    state.phase = 'paused';
    state.pausedAt = state.timeRemaining;

    updateDisplay();
    updateButtons();
  }
}

function resetTimer() {
  cancelAnimationFrame(state.animationFrameId);

  state.phase = 'idle';
  state.previousPhase = null;
  state.timeRemaining = 0;
  state.currentRound = 0;
  state.startTimestamp = null;
  state.pausedAt = null;

  releaseWakeLock();
  updateDisplay();
  updateButtons();
}

// ============================================================================
// Wake Lock
// ============================================================================

let wakeLock = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (e) {
      console.warn('Wake Lock not available:', e);
    }
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

function handleKeydown(e) {
  if (e.target.tagName === 'INPUT') {
    return; // Don't intercept when typing in inputs
  }

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      if (state.phase === 'idle' || state.phase === 'complete') {
        startTimer();
      } else {
        pauseTimer();
      }
      break;
    case 'KeyR':
      e.preventDefault();
      resetTimer();
      break;
  }
}

// ============================================================================
// Event Listeners
// ============================================================================

function init() {
  loadConfig();
  syncInputsFromConfig();
  updateDisplay();
  updateButtons();

  // Config inputs
  elements.workInput.addEventListener('change', syncConfigFromInputs);
  elements.restInput.addEventListener('change', syncConfigFromInputs);
  elements.roundsInput.addEventListener('change', syncConfigFromInputs);

  // Buttons
  elements.startBtn.addEventListener('click', startTimer);
  elements.pauseBtn.addEventListener('click', pauseTimer);
  elements.resetBtn.addEventListener('click', resetTimer);

  // Keyboard
  document.addEventListener('keydown', handleKeydown);

  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && wakeLock === null) {
      if (state.phase === 'work' || state.phase === 'rest') {
        requestWakeLock();
      }
    }
  });
}

init();
