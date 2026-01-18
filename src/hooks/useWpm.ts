import { useState, useEffect } from 'react';

const WPM_STORAGE_KEY = 'app-wpm';
const DEFAULT_WPM = 600;

export function useWpm() {
  // Initialize WPM from localStorage or default
  const [wpm, setWpmState] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_WPM;
    }
    const stored = localStorage.getItem(WPM_STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      return isNaN(parsed) ? DEFAULT_WPM : parsed;
    }
    return DEFAULT_WPM;
  });

  // Save WPM to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WPM_STORAGE_KEY, wpm.toString());
  }, [wpm]);

  const setWpm = (wpmChange: number | ((wpm: number) => number)) => {
    if (typeof wpmChange === 'function') {
      setWpmState(wpm => wpmChange(wpm));
    } else {
      setWpmState(wpmChange);
    }
  };

  return { wpm, setWpm };
}
