import React, { useState } from 'react';
import WeatherSearch from './Components/WeatherSearch';
import Map from './Components/Map';
import UserHeader from './Components/UserHeader';
import Footer from './Components/Footer';
import { ButtonGroup, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ThemeMode from './Components/ThemeMode';
import { ThemeProvider } from './Components/ThemeContext';
import SettingsModal from './Components/SettingsModal';

const App = () => {
  const [display, setDisplay] = useState('weatherSearch');   
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const [displayFlag, setDisplayFlag] = useState(true);
  const [displayFavorites, setDisplayFavorites] = useState(true);  
  const { t } = useTranslation();

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleClose = () => setIsSettingsOpen(false); 

  const displayWeatherSearch = () => {
    setDisplay('weatherSearch');
  };

  const displayMap = () => {
    setDisplay('map');
  };

  return (
    <ThemeProvider>
      <UserHeader />
      <ThemeMode toggleSettingsModal={toggleSettingsModal}/>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '24px',
        }}
      >
        <ButtonGroup
          variant='outlined'
          style={{
            display: 'flex',
          }}
        >
          <Button style={{ minWidth: '165px' }} onClick={displayWeatherSearch}>{t('title')}</Button>
          <Button style={{ minWidth: '125px' }} onClick={displayMap}>{t('titleMap')}</Button>
        </ButtonGroup>
      </div>
      {display === 'weatherSearch' && (
        <WeatherSearch 
          displayFlag={displayFlag}
          displayFavorites={displayFavorites}
        />
      )}
      {display === 'map' && (
        <Map
          displayFlag={displayFlag}
          displayFavorites={displayFavorites} 
        />
      )}
      <Footer />
      {isSettingsOpen && (
        <SettingsModal 
          open={isSettingsOpen} 
          handleClose={handleClose} 
          displayFlag={displayFlag} 
          setDisplayFlag={setDisplayFlag} 
          displayFavorites={displayFavorites} 
          setDisplayFavorites={setDisplayFavorites}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
