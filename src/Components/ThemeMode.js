import React from 'react';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from './ThemeContext';

const ThemeMode = ({ toggleSettingsModal }) => {
    const { isLightMode, toggleLightMode } = useTheme();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
            <IconButton onClick={toggleLightMode}>
                {!isLightMode && <Brightness4Icon color='primary'/>}
                {isLightMode && <Brightness7Icon />}
            </IconButton>
            <IconButton onClick={toggleSettingsModal}>
                {!isLightMode && <SettingsIcon color='primary' />}
                {isLightMode && <SettingsIcon />}
            </IconButton>
        </Box>
    );
};

export default ThemeMode;
