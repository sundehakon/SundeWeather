import React from 'react';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from './ThemeContext';

const ThemeMode = () => {
    const { isLightMode, toggleLightMode } = useTheme();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton onClick={toggleLightMode}>
                {!isLightMode && <Brightness4Icon color='primary'/>}
                {isLightMode && <Brightness7Icon />}
            </IconButton>
        </Box>
    );
};

export default ThemeMode;
