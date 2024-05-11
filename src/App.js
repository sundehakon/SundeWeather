import React, { useState } from 'react';
import axios from 'axios'; 

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

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
        <input type="text" value={location} onChange={handleLocationChange} placeholder="Enter location..." />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <h2>Weather for {weatherData.geometry.coordinates[1]}, {weatherData.geometry.coordinates[0]}</h2>
          <p>Current temperature: {weatherData.properties.timeseries[0].data.instant.details.air_temperature}°C</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
