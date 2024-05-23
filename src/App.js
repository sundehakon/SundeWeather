import React from 'react';
import WeatherApp from './Components/WeatherApp';
import UserHeader from './Components/UserHeader';
import { ButtonGroup, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const App = () => {    
  const { t } = useTranslation();

  return (
    <div>
      <UserHeader />
      <ButtonGroup sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3
      }}>
        <Button>{t('title')}</Button>
        <Button>{t('titleMap')}</Button>
      </ButtonGroup>
      <WeatherApp />
    </div>
  );
};

export default App;
