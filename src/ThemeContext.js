import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('isLightMode') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', isLightMode);
    localStorage.setItem('isLightMode', isLightMode);
  }, [isLightMode]);

  const toggleLightMode = () => {
    setIsLightMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleLightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
