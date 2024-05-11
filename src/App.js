import React, { useState } from 'react';
import axios from 'axios'; 
import { Button, Typography, Paper, Box, TextField } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './login';
import LogoutButton from './logout';
import Particle from './Components/Particle';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState(null);
  const [flag, setFlag] = useState(null);
  const [city, setCity] = useState(null);
  const [formDisabled, setFormDisabled] = useState(false); 
  const { user } = useAuth0();

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormDisabled(true);
    try {
      const geocodingResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${process.env.REACT_APP_OPENCAGEDATA_API_KEY}`);
      if (geocodingResponse.data && geocodingResponse.data.results && geocodingResponse.data.results.length > 0) {
        const { lat, lng } = geocodingResponse.data.results[0].geometry;
  
        const weatherResponse = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lng}`);
        setWeatherData(weatherResponse.data);

        const countryData = geocodingResponse.data.results[0].components.country;
        const flagData = geocodingResponse.data.results[0].annotations.flag;
        const cityData = geocodingResponse.data.results[0].components.city;
        setCountry(countryData);
        setFlag(flagData);
        setCity(cityData);
      } else {
        setError('Error: No results found for the location');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data. Please try again later.');
    } finally {
      setTimeout(() => {
        setFormDisabled(false);
      }, 10000);
    }
  };

  return (
    <div>
      <Particle />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
          {!user && 
            <LoginButton />
          }
          {user &&
            <LogoutButton />
          }
        </Box>
        <Box>
          {user && (
            <Box sx={{  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 2 }}>
              <img src={user.picture} alt='User profile' style={{ borderRadius: '50%', height: 64, width: 64 }} />
              <Typography sx={{ marginTop: 1, color: 'white' }}>
                Welcome, {user.nickname}!
              </Typography>
            </Box>
          )}
        </Box>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ padding: 7, marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 7 }}>
              <Typography variant='h3'>Weather Search</Typography>
              <TextField type="text" value={location} onChange={handleLocationChange} placeholder="Enter location..." sx={{ marginTop: 3 }} variant='outlined' disabled={formDisabled} />
              <Button type="submit" sx={{ marginTop: 3 }} disabled={formDisabled}>Get Weather</Button>
            </Paper>
          </Box>
        </form>
        {error && <p>{error}</p>}
        {weatherData && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ marginTop: 5, padding: 7, borderRadius: 7, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant='h4'>Weather for {city}, {country} {flag}</Typography>
              {weatherData.properties.timeseries[0].data.next_1_hours.summary.symbol_code === 'partlycloudy_day' && (
                <Box sx={{ height: 100, width: 100, marginTop: 2 }}>
                  <img src='https://camo.githubusercontent.com/34c36040fc5717eee8a5801f2d1702871f58b1f3c0c04ee64c2a68b299e2e407/68747470733a2f2f626d63646e2e6e6c2f6173736574732f776561746865722d69636f6e732f76332e302f66696c6c2f7376672f706172746c792d636c6f7564792d6461792e737667' alt='Partly cloudy' />
                </Box>
              )}
              <Typography sx={{ marginTop: 2 }}>Current temperature: {weatherData.properties.timeseries[0].data.instant.details.air_temperature}°C</Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default WeatherApp;
