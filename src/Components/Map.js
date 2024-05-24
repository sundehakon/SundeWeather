import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Button, Paper } from '@mui/material';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const onMapClick = useCallback((event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    };

    setMarkers((current) => [...current, newMarker]);
    setSelected(newMarker);

    handleFormSubmit(newMarker.lat, newMarker.lng);
  }, []);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log('Geolocation not supported');
    }
  };

  const success = (position) => {
    const latitudeData = position.coords.latitude;
    const longitudeData = position.coords.longitude;
    setMarkers([{ lat: latitudeData, lng: longitudeData }]);
    setSelected({ lat: latitudeData, lng: longitudeData });
    handleFormSubmit(latitudeData, longitudeData);
  };

  const error = (error) => {
    console.error('Error occurred while retrieving geolocation:', error);
  };

  const handleFormSubmit = async (lat, lng) => {
    try {
      const weatherResponse = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lng}`);
      const newWeatherData = weatherResponse.data;
      setWeatherData(newWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 1 }}>
      <Button onClick={fetchCurrentLocation}>Use My Location</Button>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Box sx={{ width: '50%', height: '50vh', minWidth: 350 }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: 0, lng: 0 }}
            zoom={2}
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
      {weatherData && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ marginTop: 5, padding: 7, borderRadius: 7, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 3 }}>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Map;
