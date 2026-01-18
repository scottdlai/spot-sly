import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'app-theme';
const DEFAULT_THEME = 'default';

export type Theme = 
  | 'default'
  | 'forest'
  | 'mcdonalds'
  | 'oat-milk'
  | 'matcha'
  | 'lemon-black-tea'
  | 'kare-raisu';

export function useTheme() {
  // Initialize theme from localStorage or default
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_THEME;
    }
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as Theme) || DEFAULT_THEME;
  });

  // Apply theme to document element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return { theme, setTheme };
}
