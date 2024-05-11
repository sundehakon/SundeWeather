import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <Button onClick={() => loginWithRedirect()} sx={{ fontWeight: 'bolder', fontSize: 17, '&:hover': { color: 'white' } }} disableRipple style={{ backgroundColor: 'transparent' }} color='success'>Log In</Button>
}

export default LoginButton;