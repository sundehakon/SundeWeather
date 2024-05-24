import LoginButton from '../login';
import LogoutButton from '../logout';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from './ThemeContext';
import Typewriter from 'typewriter-effect';

const UserHeader = () => {
    const { isAuthenticated, user } = useAuth0();
    const { isLightMode } = useTheme();

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const greetings = ['Hello', 'Welcome', 'Hi', 'Howdy', 'Greetings', 'Salutations', 'Hey', 'Hola', 'Bonjour', 'Ciao', 'Namaste', 'Salaam', 'Shalom', 'Konnichiwa', 'Guten Tag', 'Olá', 'Aloha', 'Hej', 'Hei', 'Hallo', 'Hej', 'Hoi'];
    const shuffledGreetings = shuffleArray(greetings);

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
                    <Typography sx={{ marginTop: 1, display: 'flex' }}>
                        <Typewriter 
                            options={{
                            strings: shuffledGreetings,
                            autoStart: true,
                            loop: true
                            }}
                        />
                        , {user.nickname}!
                    </Typography>
                </Box>
                )}
            </Box>
        </div>
    );
};

export default UserHeader;