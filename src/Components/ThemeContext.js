import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(() => {
    const storedMode = localStorage.getItem('isLightMode');
    return storedMode === null ? true : storedMode === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', isLightMode);
    localStorage.setItem('isLightMode', isLightMode);
  }, [isLightMode]);

  const toggleLightMode = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleLightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
