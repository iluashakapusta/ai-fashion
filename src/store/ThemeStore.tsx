import * as Font from 'expo-font';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { DEFAULT_THEME, THEMES, applyTheme, themeById } from '../theme';

const KEY = 'ai-fashion-theme';

/** The saved theme (web only for now; native storage comes with the real backend). */
export function savedThemeId(): string {
  try {
    if (typeof localStorage !== 'undefined') return themeById(localStorage.getItem(KEY)).id;
  } catch {
    // storage blocked: fall back to the default
  }
  return DEFAULT_THEME;
}

function saveThemeId(id: string) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, id);
  } catch {
    // not critical
  }
}

interface ThemeCtx {
  themeId: string;
  setTheme: (id: string) => Promise<void>;
  /** Loads every theme's fonts so the picker can preview them. */
  preloadAll: () => Promise<void>;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ initial, children }: { initial: string; children: (themeId: string) => React.ReactNode }) {
  const [themeId, setThemeId] = useState(initial);

  const setTheme = useCallback(async (id: string) => {
    const t = themeById(id);
    await Font.loadAsync(t.assets);
    applyTheme(t.id);
    saveThemeId(t.id);
    setThemeId(t.id);
  }, []);

  const preloadAll = useCallback(async () => {
    await Promise.all(THEMES.map((t) => Font.loadAsync(t.assets)));
  }, []);

  return <Ctx.Provider value={{ themeId, setTheme, preloadAll }}>{children(themeId)}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme outside ThemeProvider');
  return c;
}
