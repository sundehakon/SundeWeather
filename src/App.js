import React from 'react';
import WeatherApp from './Components/WeatherApp';
import UserHeader from './Components/UserHeader';

const App = () => {
  return (
    <div>
      <UserHeader />
      <WeatherApp />
    </div>
  );
};

export default App;
