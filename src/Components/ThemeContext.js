import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('isLightMode') === 'true';
  });

  const toggleLightMode = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    document.documentElement.classList.toggle('light-mode', newMode);
    localStorage.setItem('isLightMode', newMode);
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
