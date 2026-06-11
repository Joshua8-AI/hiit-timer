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
    return true;
  } catch (e) {
    console.warn('Failed to unlock audio:', e);
    return false;
  }
}

// Schedules a tone `delay` seconds from now on the AudioContext clock,
// which stays accurate even when the browser throttles JS timers
function playTone(frequency, duration, delay = 0) {
  try {
    const ctx = getAudioContext();

    // Try to resume if not unlocked (fallback)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const startTime = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // Envelope: quick attack, hold, quick release
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
    gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// Work phase start: High pitched double beep
function playWorkSound() {
  playTone(880, 0.1); // A5
  playTone(880, 0.1, 0.2);
}

// Rest phase start: Lower pitched single beep
function playRestSound() {
  playTone(440, 0.3); // A4, longer single tone
}

// Workout complete: Ascending melody
function playCompleteSound() {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playTone(freq, 0.2, i * 0.15);
  });
}

// Expose functions globally
window.unlockAudio = unlockAudio;
window.playWorkSound = playWorkSound;
window.playRestSound = playRestSound;
window.playCompleteSound = playCompleteSound;
