import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { THEMES, THEME_STORAGE_KEY } from "../lib/constants";

export const ThemeContext = createContext(null);

const DARK_QUERY = "(prefers-color-scheme: dark)";

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === THEMES.light || stored === THEMES.dark
      ? stored
      : THEMES.system;
  } catch {
    return THEMES.system;
  }
}

function getSystemTheme() {
  return window.matchMedia(DARK_QUERY).matches ? THEMES.dark : THEMES.light;
}

function applyTheme(resolved) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === THEMES.dark);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // Follow OS changes while in "system" mode
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = (e) =>
      setSystemTheme(e.matches ? THEMES.dark : THEMES.light);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme = theme === THEMES.system ? systemTheme : theme;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      if (next === THEMES.system) {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      // Storage unavailable (private mode etc.). Theme still works for this session.
    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}