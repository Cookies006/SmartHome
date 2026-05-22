import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    isDark: isDarkMode,
    colors: isDarkMode ? {
      bgApp: '#050A17',
      surface: '#121A2E',
      surfaceTint: '#162343',
      textDark: '#E8F1FF',
      textMuted: '#8EA3C1',
      primary: '#5D82FF',
      danger: '#FF6E7A',
      dangerBg: '#3B1820',
      accentPurpleBg: '#1E2142',
      accentPurpleText: '#99A8FF',
      bgGray: '#101B2E',
      cardShadow: '#00000080',
    } : {
      bgApp: '#EBF2FA',
      surface: '#FFFFFF',
      surfaceTint: '#E8EEF9',
      textDark: '#121A2F',
      textMuted: '#64748B',
      primary: '#2C5282',
      danger: '#F08080',
      dangerBg: '#FCE8E8',
      accentPurpleBg: '#EAE0F8',
      accentPurpleText: '#B794F6',
      bgGray: '#CFD8DC',
      cardShadow: '#00000020',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};