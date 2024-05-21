import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

function LogoutButton({ isLightMode }) {
    const { logout } = useAuth0();

    return <Button onClick={() => logout({ returnTo: window.location.origin })} sx={{ fontWeight: 'bolder', fontSize: 17, '&:hover': { color: isLightMode ? 'black' : 'white' } }} disableRipple style={{ backgroundColor: 'transparent' }} color='error'>Log Out</Button>
}

export default LogoutButton;