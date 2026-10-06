import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, darkColors, lightColors} from '../constants/theme';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  colors: Colors;
  isDark: boolean;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = '@home-ledger/theme-mode';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(savedMode => {
      if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
        setMode(savedMode);
      }
    });
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const setThemeMode = (nextMode: ThemeMode) => {
    setMode(nextMode);
    AsyncStorage.setItem(STORAGE_KEY, nextMode);
  };
  const value = useMemo<ThemeContextValue>(() => ({
    colors: isDark ? darkColors : lightColors,
    isDark,
    mode,
    toggleTheme: () => {
      const nextMode: ThemeMode = isDark ? 'light' : 'dark';
      setThemeMode(nextMode);
    },
    setMode: setThemeMode,
  }), [isDark, mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
