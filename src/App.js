import React, { useState } from 'react';
import WeatherSearch from './Components/WeatherSearch';
import InteractiveMap from './Components/InteractiveMap';
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
  const [open, setOpen] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(true);
  const [displayFavorites, setDisplayFavorites] = useState(true);  
  const { t } = useTranslation();

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleClose = () => setOpen(false); 

  const displayWeatherSearch = () => {
    setDisplay('weatherSearch');
  };

  const displayInteractiveMap = () => {
    setDisplay('interactiveMap');
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
          <Button style={{ minWidth: '125px' }} onClick={displayInteractiveMap}>{t('titleMap')}</Button>
        </ButtonGroup>
      </div>
      {display === 'weatherSearch' && <WeatherSearch />}
      {display === 'interactiveMap' && <InteractiveMap />}
      <Footer />
      {isSettingsOpen && <SettingsModal open={open} handleClose={handleClose} displayFlag={displayFlag} setDisplayFlag={setDisplayFlag} displayFavorites={displayFavorites} setDisplayFavorites={setDisplayFavorites}/>}
    </ThemeProvider>
  );
};

export default App;
