import React, { useState } from 'react';
import axios from 'axios'; 
import { Button, Typography, Paper } from '@mui/material';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState(null);
  const [flag, setFlag] = useState(null);
  const [city, setCity] = useState(null);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
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
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <Paper sx={{ width: 200 }}>
          <Typography>SundeWeather Search</Typography>
          <input type="text" value={location} onChange={handleLocationChange} placeholder="Enter location..." />
          <Button type="submit">Get Weather</Button>
        </Paper>
      </form>
      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <h2>Weather for {city}, {country} {flag}</h2>
          <p>Current temperature: {weatherData.properties.timeseries[0].data.instant.details.air_temperature}°C</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
