import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../App.css';

const Footer = () => {
  const { t } = useTranslation();
  const [isLightMode] = useState(() => {
    return localStorage.getItem('isLightMode') === 'true';
  });

  return (
    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant='caption'>
        {t('data')}
      </Typography>
      <Typography sx={{ marginBottom: 2 }} variant='caption'>
        {t('credit')}{' '}
        <a
          href='https://sundehakon.tech/'
          target='_blank'
          rel='noreferrer'
          style={{ color: isLightMode ? 'black' : 'white' }}
        >
          Håkon Sunde
        </a>
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginBottom: 5 }}>
        <a href='https://github.com/sundehakon' target='_blank' rel='noreferrer'>
          {!isLightMode ? (
            <img src='/images/svgrepo-github-white.png' alt='GitHub alogo' style={{ height: 32, width: 32 }} />
          ) : (
            <img src='/images/github-logo.png' alt='GitHub logo' style={{ height: 32, width: 32 }} />
          )}
        </a>
        <a href='https://twitter.com/lordsunde' target='_blank' rel='noreferrer'>
          <img src='https://raw.githubusercontent.com/jmnote/z-icons/master/svg/twitter.svg' alt='Twitter logo' style={{ height: 32, width: 32 }} />
        </a>
      </Box>
    </Box>
  );
};

export default Footer;
