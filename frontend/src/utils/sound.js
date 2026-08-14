const SOUND_LIBRARY = {
  plant: { freq: 420, duration: 0.14, type: 'triangle', volume: 0.035, slide: 80 },
  harvest: { freq: 760, duration: 0.22, type: 'sine', volume: 0.045, slide: 160 },
  water: { freq: 260, duration: 0.18, type: 'sine', volume: 0.03, slide: 120 },
  rain: { freq: 180, duration: 0.3, type: 'triangle', volume: 0.025, slide: 60 },
  coin: { freq: 980, duration: 0.08, type: 'square', volume: 0.025, slide: 180 },
};

let audioContext = null;

export const initAudio = () => {
  if (typeof window === 'undefined') return null;

  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
};

export const playSound = (name) => {
  const config = SOUND_LIBRARY[name];
  if (!config) return;

  const ctx = initAudio();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.freq, ctx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(
    config.freq + config.slide,
    ctx.currentTime + config.duration
  );

  gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(config.volume, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + config.duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + config.duration + 0.02);
};
