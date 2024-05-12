import React, { useState } from 'react';
import axios from 'axios'; 
import './App.css';
import { Button, Typography, Paper, Box, TextField, RadioGroup, FormControl, FormControlLabel, Radio } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './login';
import LogoutButton from './logout';

const symbolMapping = {
  clearsky_day: '/svg/01d.svg',
  clearsky_night: '/svg/01n.svg',
  clearsky_polartwilight: '/svg/01m.svg',
  fair_day: '/svg/02d.svg',
  fair_night: '/svg/02n.svg',
  fair_polartwilight: '/svg/02m.svg',
  partlycloudy_day: '/svg/03d.svg',
  partlycloudy_night: '/svg/03n.svg',
  partlycloudy_polartwilight: '/svg/03m.svg',
  cloudy: '/svg/04.svg',
  rainshowers_day: '/svg/05d.svg',
  rainshowers_night: '/svg/05n.svg',
  rainshowers_polartwilight: '/svg/05m.svg',
  rainshowersandthunder_day: '/svg/06d.svg',
  rainshowersandthunder_night: '/svg/06n.svg',
  rainshowersandthunder_polartwilight: '/svg/06m.svg',
  sleetshowers_day: '/svg/07d.svg',
  sleetshowers_night: '/svg/07n.svg',
  sleetshowers_polartwilight: '/svg/07m.svg',
  snowshowers_day: '/svg/08d.svg',
  snowshowers_night: '/svg/08n.svg',
  snowshowers_polartwilight: '/svg/08m.svg',
  rain: '/svg/09.svg',
  heavyrain: '/svg/10.svg',
  heavyrainandthunder: '/svg/11.svg',
  sleet: '/svg/12.svg',
  snow: '/svg/13.svg',
  snowandthunder: '/svg/14.svg',
  fog: '/svg/15.svg',
  sleetshowersandthunder_day: '/svg/20d.svg',
  sleetshowersandthunder_night: '/svg/20n.svg',
  sleetshowersandthunder_polartwilight: '/svg/20m.svg',
  snowshowersandthunder_day: '/svg/21d.svg',
  snowshowersandthunder_night: '/svg/21n.svg',
  snowshowersandthunder_polartwilight: '/svg/21m.svg',
  rainandthunder: '/svg/22.svg',
  sleetandthunder: '/svg/23.svg',
  lightrainshowersandthunder_day: '/svg/24d.svg',
  lightrainshowersandthunder_night: '/svg/24n.svg',
  lightrainshowersandthunder_polartwilight: '/svg/24m.svg',
  heavyrainshowersandthunder_day: '/svg/25d.svg',
  heavyrainshowersandthunder_night: '/svg/25n.svg',
  heavyrainshowersandthunder_polartwilight: '/svg/25m.svg',
  lightssleetshowersandthunder_day: '/svg/26d.svg',
  lightssleetshowersandthunder_night: '/svg/26n.svg',
  lightssleetshowersandthunder_polartwilight: '/svg/26m.svg',
  heavysleetshowersandthunder_day: '/svg/27d.svg',
  heavysleetshowersandthunder_night: '/svg/27n.svg',
  heavysleetshowersandthunder_polartwilight: '/svg/27m.svg',
  lightssnowshowersandthunder_day: '/svg/28d.svg',
  lightssnowshowersandthunder_night: '/svg/28n.svg',
  lightssnowshowersandthunder_polartwilight: '/svg/28m.svg',
  heavysnowshowersandthunder_day: '/svg/29d.svg',
  heavysnowshowersandthunder_night: '/svg/29n.svg',
  heavysnowshowersandthunder_polartwilight: '/svg/29m.svg',
  lightrainandthunder: '/svg/30.svg',
  lightsleetandthunder: '/svg/31.svg',
  heavysleetandthunder: '/svg/32.svg',
  lightsnowandthunder: '/svg/33.svg',
  heavysnowandthunder: '/svg/34.svg',
  lightrainshowers_day: '/svg/40d.svg',
  lightrainshowers_night: '/svg/40n.svg',
  lightrainshowers_polartwilight: '/svg/40m.svg',
  heavyrainshowers_day: '/svg/41d.svg',
  heavyrainshowers_night: '/svg/41n.svg',
  heavyrainshowers_polartwilight: '/svg/41m.svg',
  lightsleetshowers_day: '/svg/42d.svg',
  lightsleetshowers_night: '/svg/42n.svg',
  lightsleetshowers_polartwilight: '/svg/42m.svg',
  heavysleetshowers_day: '/svg/43d.svg',
  heavysleetshowers_night: '/svg/43n.svg',
  heavysleetshowers_polartwilight: '/svg/43m.svg',
  lightsnowshowers_day: '/svg/44d.svg',
  lightsnowshowers_night: '/svg/44n.svg',
  lightsnowshowers_polartwilight: '/svg/44m.svg',
  heavysnowshowers_day: '/svg/45d.svg',
  heavysnowshowers_night: '/svg/45n.svg',
  heavysnowshowers_polartwilight: '/svg/45m.svg',
  lightrain: '/svg/46.svg',
  lightsleet: '/svg/47.svg',
  heavysleet: '/svg/48.svg',
  lightsnow: '/svg/49.svg',
  heavysnow: '/svg/50.svg',
};

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState(null);
  const [flag, setFlag] = useState(null);
  const [city, setCity] = useState(null);
  const [archipelago, setArchipelago] = useState(null);
  const [normalizedCity, setNormalizedCity] = useState(null);
  const [formDisabled, setFormDisabled] = useState(false); 
  const [unit, setUnit] = useState('˚C');  
  const [temperature, setTemperature] = useState(0);
  const { user } = useAuth0();

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);

    if (event.target.value === '˚C') {
      setTemperature(weatherData.properties.timeseries[0].data.instant.details.air_temperature);
    } else if (event.target.value === '˚F') {
      const convertedTemperature = weatherData.properties.timeseries[0].data.instant.details.air_temperature * 9/5 + 32;
      setTemperature(convertedTemperature);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setFormDisabled(true);
    try {
      const geocodingResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${process.env.REACT_APP_OPENCAGEDATA_API_KEY}`);
      if (geocodingResponse.data && geocodingResponse.data.results && geocodingResponse.data.results.length > 0) {
        const { lat, lng } = geocodingResponse.data.results[0].geometry;
  
        const weatherResponse = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lng}`);
        const newWeatherData = weatherResponse.data;
        setWeatherData(newWeatherData);
  
        const countryData = geocodingResponse.data.results[0].components.country;
        const flagData = geocodingResponse.data.results[0].annotations.flag;
        const cityData = geocodingResponse.data.results[0].components.city;
        const archipelagoData = geocodingResponse.data.results[0].components.archipelago;
        const normalizedCityData = geocodingResponse.data.results[0].components._normalized_city;
        setCountry(countryData);
        setFlag(flagData);
        setCity(cityData);
        setArchipelago(archipelagoData);
        setNormalizedCity(normalizedCityData);
  
        if (unit === '˚C') {
          setTemperature(newWeatherData.properties.timeseries[0].data.instant.details.air_temperature);
        } else if (unit === '˚F') {
          const convertedTemperature = newWeatherData.properties.timeseries[0].data.instant.details.air_temperature * 9/5 + 32;
          setTemperature(convertedTemperature);
        }
      } else {
        setError('Error: No results found for the location');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data. Please try again later.');
    } finally {
      if (user) {
        setTimeout(() => {
          setFormDisabled(false);
        }, 100);
      }
      setTimeout(() => {
        setFormDisabled(false);
      }, 10000);
    }
  };
  

  return (
    <div>
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
            <Paper sx={{ padding: 7, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 7 }}>
              <Typography variant='h3' sx={{ textAlign: 'center' }}>Weather Search</Typography>
              <TextField type="text" value={location} onChange={handleLocationChange} placeholder="Enter location..." sx={{ marginTop: 3 }} variant='outlined' disabled={formDisabled} />
              <Button type="submit" sx={{ marginTop: 3 }} disabled={formDisabled}>Get Weather</Button>
              <Typography sx={{ marginTop: 3, fontSize: 10, textAlign: 'center' }}>ps. if weather doesnt show try adding the country to the request...</Typography>
            </Paper>
          </Box>
        </form>
        {error && <Typography sx={{ textAlign: 'center', color: 'white', marginTop: 2 }}>{error}</Typography>}
        {weatherData && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ marginTop: 5, padding: 7, borderRadius: 7, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                {city &&
                  <Typography variant='h4'>Weather for {city}, {country} {flag}</Typography>
                }
                {archipelago &&
                  <Typography variant='h4'>Weather for {archipelago}, {country} {flag}</Typography>
                }
                {!city && normalizedCity &&
                  <Typography variant='h4'>Weather for {normalizedCity}, {country} {flag}</Typography>
                }
                {!city && !normalizedCity && country &&
                  <Typography variant='h4'>Weather for {country} {flag}</Typography>
                }
              </Box>
                <Box sx={{ height: 100, width: 100, marginTop: 2 }}>
                  <img src={symbolMapping[weatherData.properties.timeseries[0].data.next_1_hours.summary.symbol_code]} alt='Weather symbol' />
                </Box>
                <Typography sx={{ marginTop: 1 }} variant='h4'>{temperature} {unit}</Typography>
                <FormControl>
                  <RadioGroup
                    row
                    value={unit}
                    onChange={handleUnitChange}
                    sx={{ marginTop: 2 }}
                  >
                    <FormControlLabel value='˚C' control={<Radio />} label='Celsius' />
                    <FormControlLabel value='˚F' control={<Radio />} label='Fahrenheit' />
                  </RadioGroup>
                </FormControl>
            </Paper>
          </Box>
        )}
        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography sx={{ color: 'white', marginTop: 2, marginBottom: 1 }} variant='caption'>Data from YR and OpenCage</Typography>
          <Typography sx={{ color: 'white', marginBottom: 2 }} variant='caption'>Website created by <a href='https://sundehakon.netlify.app/' target='_blank' rel='noreferrer' style={{ color: 'white' }}>Håkon Sunde</a></Typography>
          <a href='https://github.com/sundehakon' target='_blank' rel='noreferrer'><img src='github-white.png' alt='GitHub logo' style={{ height: 32, width: 32, marginBottom: 20 }} /></a>
        </Box>
      </Box>
    </div>
  );
}

export default WeatherApp;
