import React, { createContext, useContext, useState, useEffect } from 'react';

const themeColors = {
  golden: {
    primary: '#FFD700',
    secondary: '#FFA500', 
    accent: '#FF8C00',
    gradient: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
    bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
    cardBg: 'rgba(255, 215, 0, 0.1)',
    tailwind: {
      primary: 'yellow-400',
      secondary: 'orange-400',
      accent: 'orange-500',
      text: 'yellow-600',
      bg: 'gray-900',
      card: 'yellow-50'
    }
  },
  emerald: {
    primary: '#10B981',
    secondary: '#059669',
    accent: '#047857', 
    gradient: 'linear-gradient(135deg, #10B981, #059669, #047857)',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)',
    cardBg: 'rgba(16, 185, 129, 0.1)',
    tailwind: {
      primary: 'emerald-500',
      secondary: 'emerald-600',
      accent: 'emerald-700',
      text: 'emerald-600',
      bg: 'gray-900',
      card: 'emerald-50'
    }
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('golden');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('selectedTheme') || sessionStorage.getItem('selectedTheme');
    if (savedTheme && themeColors[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const switchTheme = (themeName) => {
    if (themeColors[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
      sessionStorage.setItem('selectedTheme', themeName);
    }
  };

  const getCurrentColors = () => {
    return themeColors[currentTheme] || themeColors.golden;
  };

  const getTailwindClasses = () => {
    return themeColors[currentTheme]?.tailwind || themeColors.golden.tailwind;
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      switchTheme,
      colors: getCurrentColors(),
      tailwind: getTailwindClasses(),
      themeColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
