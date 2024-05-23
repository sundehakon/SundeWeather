import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box } from '@mui/material';

const style = {
    width: '600px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng:-38.523
};

const Map = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={style}
                    center={center}
                    zoom={10}
                >
                    <Marker />
                </GoogleMap>
            </LoadScript>
        </Box>
    );
};

export default Map;