import React from 'react';
import WeatherApp from './Components/WeatherApp';
import LanguageSwitcher from './Components/LanguageSwitcher';

const App = () => {
  return (
    <div>
      <LanguageSwitcher />
      <WeatherApp />
    </div>
  );
};

export default App;
