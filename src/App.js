import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './App.css';
import { Button, Typography, Paper, Box, TextField, RadioGroup, FormControl, FormControlLabel, Radio, IconButton } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './login';
import LogoutButton from './logout';
import { symbolMapping } from './Components/SymbolMapping';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState(null); 
  const [flag, setFlag] = useState(null);
  const [city, setCity] = useState(null);
  const [archipelago, setArchipelago] = useState(null);
  const [normalizedCity, setNormalizedCity] = useState(null);
  const [state, setState] = useState(null);
  const [continent, setContinent] = useState(null);
  const [formatted, setFormatted] = useState(null);
  const [formDisabled, setFormDisabled] = useState(false); 
  const [unit, setUnit] = useState('˚C');  
  const [temperature, setTemperature] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth0();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);

    if (event.target.value === '˚C') {
      setTemperature(weatherData.properties.timeseries[0].data.instant.details.air_temperature);
    } else if (event.target.value === '˚F') {
      const convertedTemperature = weatherData.properties.timeseries[0].data.instant.details.air_temperature * 9/5 + 32;
      const formattedTemperature = convertedTemperature.toFixed(2);
      setTemperature(parseFloat(formattedTemperature));
    }
  };

  const handleCardDelete = () => {
    setWeatherData(null);
    setCountry(null);
    setFlag(null);
    setCity(null);
    setArchipelago(null);
    setNormalizedCity(null);
    setState(null);
    setContinent(null);
    setFormatted(null);
    setTemperature(0);
    setLocation('');
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
        const stateData = geocodingResponse.data.results[0].components.state;
        const continentData = geocodingResponse.data.results[0].components.continent;
        const formattedData = geocodingResponse.data.results[0].components.formatted;
        setCountry(countryData);
        setFlag(flagData);
        setCity(cityData);
        setArchipelago(archipelagoData);
        setNormalizedCity(normalizedCityData);
        setState(stateData);
        setContinent(continentData);
        setFormatted(formattedData);
  
        if (unit === '˚C') {
          setTemperature(newWeatherData.properties.timeseries[0].data.instant.details.air_temperature);
        } else if (unit === '˚F') {
          const convertedTemperature = newWeatherData.properties.timeseries[0].data.instant.details.air_temperature * 9/5 + 32;
          setTemperature(convertedTemperature);
        }
      } else {
        setError('Error: No results found for the location');
        handleCardDelete();
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
  
  const handleFavorite = () => {
    const favoriteData = {
      lat: weatherData.geometry.coordinates[1],
      lon: weatherData.geometry.coordinates[0],
      country: country,
      flag: flag,
      city: city,
      archipelago: archipelago,
      normalizedCity: normalizedCity,
      state: state,
      continent: continent,
      formatted: formatted,
    };
    const newFavorites = [...favorites, favoriteData];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const handleRemoveFavorite = () => {
    const newFavorites = favorites.filter((favorite) => 
      !(favorite.lat === weatherData.geometry.coordinates[1] && favorite.lon === weatherData.geometry.coordinates[0])
    );
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const isFavorite = () => {
    return favorites.some(favorite => 
      favorite.lat === weatherData.geometry.coordinates[1] && favorite.lon === weatherData.geometry.coordinates[0]
    );
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
            <Paper sx={{ padding: 9, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 7 }}>
              <Typography variant='h3' sx={{ textAlign: 'center' }}>Weather Search</Typography>
              <TextField type="text" value={location} onChange={handleLocationChange} placeholder="Enter location..." sx={{ marginTop: 3 }} variant='outlined' disabled={formDisabled} />
              <Button type="submit" sx={{ marginTop: 3 }} disabled={formDisabled}>Get Weather</Button>
              <Typography sx={{ marginTop: 3, fontSize: 10, textAlign: 'center' }}>If weather doesnt show try adding the country to the request...</Typography>
              {favorites.map(function(data) {
                return (
                  <Typography>{data.city}</Typography>
                )
              })}
            </Paper>
          </Box>
        </form>
        {error && <Typography sx={{ textAlign: 'center', color: 'red', marginTop: 2 }} variant='h6'>{error}</Typography>}
        {weatherData && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ marginTop: 5, padding: 7, borderRadius: 7, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                {!isFavorite() &&
                <IconButton onClick={handleFavorite}>
                  <FavoriteBorderIcon />
                </IconButton>
                }
                {isFavorite() &&
                  <IconButton onClick={handleRemoveFavorite}>
                    <FavoriteIcon />
                  </IconButton>
                }
                <IconButton onClick={handleCardDelete}>
                  <CloseIcon />
                </IconButton>
            </Box>
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
                {!city && !normalizedCity && !state && country &&
                  <Typography variant='h4'>Weather for {country} {flag}</Typography>
                }
                {!city && !normalizedCity && state &&
                  <Typography variant='h4'>Weather for {state}, {country} {flag}</Typography>
                }
                {!city && !normalizedCity && !state && !country && continent &&
                  <Typography variant='h4'>Weather for {continent} {flag}</Typography>
                }
                {!city && !normalizedCity && !state && !country && !continent && formatted &&
                  <Typography variant='h4'>Weather for {formatted} {flag}</Typography>
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
          <Typography sx={{ color: 'white', marginTop: 2, marginBottom: 1 }} variant='caption'>Data from Yr and OpenCage</Typography>
          <Typography sx={{ color: 'white', marginBottom: 2 }} variant='caption'>Website created by <a href='https://sundehakon.tech/' target='_blank' rel='noreferrer' style={{ color: 'white' }}>Håkon Sunde</a></Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginBottom: 5 }}>
            <a href='https://github.com/sundehakon' target='_blank' rel='noreferrer'><img src='github-white.png' alt='GitHub logo' style={{ height: 32, width: 32 }} /></a>
            <a href='https://twitter.com/lordsunde' target='_blank' rel='noreferrer'><img src='https://raw.githubusercontent.com/jmnote/z-icons/master/svg/twitter.svg' alt='Twitter logo' style={{ height: 32, width: 32 }}/></a>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default WeatherApp;
