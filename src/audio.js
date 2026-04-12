// HIIT Timer Audio Module
// Uses Web Audio API to generate tones without external files

let audioContext = null;
let audioUnlocked = false;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// iOS requires audio to be unlocked by a user gesture
// Call this on first user interaction (e.g., Start button click)
async function unlockAudio() {
  if (audioUnlocked) return true;

  try {
    const ctx = getAudioContext();

    // Resume the context (required for iOS)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Play a silent sound to fully unlock on iOS
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime); // Silent
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.001);

    audioUnlocked = true;
    console.log('Audio unlocked successfully');
    return true;
  } catch (e) {
    console.warn('Failed to unlock audio:', e);
    return false;
  }
}

function playTone(frequency, duration, type = 'sine') {
  try {
    const ctx = getAudioContext();

    // Try to resume if not unlocked (fallback)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Envelope: quick attack, hold, quick release
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

function playBeeps(frequency, count, beepDuration, gap) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      playTone(frequency, beepDuration);
    }, i * (beepDuration * 1000 + gap));
  }
}

// Work phase start: High pitched double beep
function playWorkSound() {
  playBeeps(880, 2, 0.1, 100); // A5, 2 beeps
}

// Rest phase start: Lower pitched single beep
function playRestSound() {
  playTone(440, 0.3); // A4, longer single tone
}

// Workout complete: Ascending melody
function playCompleteSound() {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.2);
    }, i * 150);
  });
}

// Expose functions globally
window.unlockAudio = unlockAudio;
window.playWorkSound = playWorkSound;
window.playRestSound = playRestSound;
window.playCompleteSound = playCompleteSound;
