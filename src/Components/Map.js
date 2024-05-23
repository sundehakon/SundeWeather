import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';

const style = {
    width: '600px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const Map = () => {
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);

    const onMapClick = useCallback((event) => {
        const newMarker = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date(),
        };

        setMarkers(current => [
            ...current,
            newMarker,
        ]);

        setSelected(newMarker);
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 1 }}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={style}
                    center={center}
                    zoom={10}
                    options={options}
                    onClick={onMapClick}
                >
                    {markers.map((marker, index) => (
                        <Marker 
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            icon={{
                                url: '/logo192.png',
                                scaledSize: new window.google.maps.Size(30, 30)
                            }}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </Box>
    );  
};

export default Map;
