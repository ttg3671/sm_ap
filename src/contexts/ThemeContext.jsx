import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('golden');

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') || sessionStorage.getItem('selectedTheme');
    if (savedTheme && (savedTheme === 'golden' || savedTheme === 'emerald')) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themeName === 'golden' || themeName === 'emerald') {
      setCurrentTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
      sessionStorage.setItem('selectedTheme', themeName);
    }
  };

  const value = {
    theme: currentTheme,
    changeTheme,
    isGolden: currentTheme === 'golden',
    isEmerald: currentTheme === 'emerald'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
