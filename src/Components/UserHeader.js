import LoginButton from '../login';
import LogoutButton from '../logout';
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

const UserHeader = () => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth0();
    const [isLightMode] = useState(() => {
        return localStorage.getItem('isLightMode') === 'true';
      });

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
                {!isAuthenticated && <LoginButton isLightMode={isLightMode}/>}
                {isAuthenticated && <LogoutButton isLightMode={isLightMode}/>}
            </Box>
            <Box>
                {isAuthenticated && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 2 }}>
                    <img src={user.picture} alt='User profile' style={{ borderRadius: '50%', height: 64, width: 64 }} />
                    <Typography sx={{ marginTop: 1 }}>{t('welcome')} {user.nickname}!</Typography>
                </Box>
                )}
            </Box>
        </div>
    );
};

export default UserHeader;