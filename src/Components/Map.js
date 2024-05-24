import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Typography, Button } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapCenter = {
  lat: -3.745,
  lng: -38.523,
};

const mapOptions = {
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

    setMarkers((current) => [...current, newMarker]);
    setSelected(newMarker);
  }, []);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log('Geolocation not supported');
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  };

  const error = (error) => {
    console.error('Error occurred while retrieving geolocation:', error);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 1 }}>
    <Button onClick={fetchCurrentLocation}>Use My Location</Button>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Box sx={{ width: '50%', height: '50vh', minWidth: 350 }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={1}
            options={mapOptions}
            onClick={onMapClick}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: '/logo192.png',
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ))}
          </GoogleMap>
        </Box>
      </LoadScript>
      {selected && (
        <div>
          <Typography>Latitude: {selected.lat}</Typography>
          <Typography>Longitude: {selected.lng}</Typography>
        </div>
      )}
    </Box>
  );
};

export default Map;
