import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  defaultTimer: 60,
  defaultMode: 'word',
  soundEnabled: false,
  showLiveWpm: true,
  showLiveAccuracy: true,
  caretStyle: 'line', // 'line' | 'block' | 'underline'
};

const STORAGE_KEY = 'typekaro_settings';

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// Web Audio API tick sound generator
let audioCtx = null;
function playTickSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.06);
}

export function useSettings() {
  const [settings, setSettingsState] = useState(loadSettings);

  const setSettings = useCallback((updater) => {
    setSettingsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveSettings(next);
      return next;
    });
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [settings.theme]);

  const tickSound = useCallback(() => {
    if (settings.soundEnabled) {
      playTickSound();
    }
  }, [settings.soundEnabled]);

  return { settings, setSettings, tickSound };
}

export { DEFAULT_SETTINGS };
