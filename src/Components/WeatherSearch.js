import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import SettingsModal from './SettingsModal';
import { Button, Typography, Paper, Box, TextField, RadioGroup, FormControl, FormControlLabel, Radio, IconButton } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { symbolMapping } from './SymbolMapping';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';

function WeatherSearch() {
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
  const [secondTemperature, setSecondTemperature] = useState(0);
  const [thirdTemperature, setThirdTemperature] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [open, setOpen] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(true);
  const [displayFavorites, setDisplayFavorites] = useState(true);
  const [localTime, setLocalTime] = useState(null);
  const [firstTime, setFirstTime] = useState(null);
  const [secondTime, setSecondTime] = useState(null);
  const [thirdTime, setThirdTime] = useState(null);
  const { t, i18n } = useTranslation();
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('isLightMode') === 'true';
  });
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19) + 'Z';
    setLocalTime(localISOTime);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const userFavorites = storedFavorites.filter(fav => fav.userId === user.sub);
      setFavorites(userFavorites);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);

    if (event.target.value === '˚C') {
      setTemperature(weatherData.properties.timeseries[0].data.instant.details.air_temperature);
      setSecondTemperature(weatherData.properties.timeseries[1].data.instant.details.air_temperature);
    } else if (event.target.value === '˚F') {
      const convertedTemperature = weatherData.properties.timeseries[0].data.instant.details.air_temperature * 9 / 5 + 32;
      const secondConvertedTemperature = weatherData.properties.timeseries[1].data.instant.details.air_temperature * 9 / 5 + 32;
      const formattedTemperature = convertedTemperature.toFixed(2);
      const secondFormattedTemperature = secondConvertedTemperature.toFixed(2);
      setTemperature(parseFloat(formattedTemperature));
      setSecondTemperature(parseFloat(secondFormattedTemperature));
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
  
        const matchingTimeseriesIndex = newWeatherData.properties.timeseries.findIndex(timeseries => timeseries.time === localTime);
        if (matchingTimeseriesIndex === -1) {
          setError('No matching timeseries found for the current local time.');
          handleCardDelete();
        } else {
          const firstTimeseries = newWeatherData.properties.timeseries[matchingTimeseriesIndex];
          const secondTimeseries = newWeatherData.properties.timeseries[matchingTimeseriesIndex + 1];
          const thirdTimeseries = newWeatherData.properties.timeseries[matchingTimeseriesIndex + 2];
  
          setWeatherData({ ...newWeatherData, properties: { ...newWeatherData.properties, timeseries: [firstTimeseries, secondTimeseries, thirdTimeseries] } });
          setFirstTime(firstTimeseries.time);
          setSecondTime(secondTimeseries.time);
          setThirdTime(thirdTimeseries.time);
          setTemperature(firstTimeseries.data.instant.details.air_temperature);
          setSecondTemperature(secondTimeseries.data.instant.details.air_temperature);
          setThirdTemperature(thirdTimeseries.data.instant.details.air_temperature);
        }
  
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
      } else {
        setError('Error: No results found for the location');
        handleCardDelete();
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data. Please try again later.');
    } finally {
      setFormDisabled(false);
    }
  };
  

  const handleFavorite = () => {
    if (!isAuthenticated) return;
    const favoriteData = {
      lat: weatherData.geometry.coordinates[1],
      lon: weatherData.geometry.coordinates[0],
      userId: user.sub,
      country: country,
      flag: flag,
      city: city,
      archipelago: archipelago,
      normalizedCity: normalizedCity,
      state: state,
      continent: continent,
      formatted: formatted,
    };
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const newFavorites = [...storedFavorites, favoriteData];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites.filter(fav => fav.userId === user.sub));
  };

  const handleRemoveFavorite = () => {
    if (!isAuthenticated) return;
    const newFavorites = favorites.filter((favorite) =>
      !(favorite.lat === weatherData.geometry.coordinates[1] && favorite.lon === weatherData.geometry.coordinates[0])
    );
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = storedFavorites.filter(fav =>
      !(fav.lat === weatherData.geometry.coordinates[1] && fav.lon === weatherData.geometry.coordinates[0] && fav.userId === user.sub)
    );
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(newFavorites);
  };

  const isFavorite = () => {
    return favorites.some(favorite =>
      favorite.lat === weatherData.geometry.coordinates[1] && favorite.lon === weatherData.geometry.coordinates[0]
    );
  };

  const handleFavoriteClick = (favorite) => {
    const locationString = `${favorite.city || favorite.normalizedCity || favorite.state || favorite.country || favorite.continent || favorite.formatted}`;
    setLocation(locationString);
    handleFormSubmit({ preventDefault: () => { } });
  };

  const toggleLightMode = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    document.documentElement.classList.toggle('light-mode', newMode);
    localStorage.setItem('isLightMode', newMode);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ padding: 9, marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 7, boxShadow: 3 }}>
              <Box sx={{ alignSelf: 'flex-end', marginBottom: 3 }}>
                <IconButton onClick={toggleLightMode}>
                  {!isLightMode && <Brightness4Icon />}
                  {isLightMode && <Brightness7Icon />}
                </IconButton>
                <IconButton onClick={handleOpen}>
                  <SettingsIcon />
                </IconButton>
              </Box>
              <Typography variant='h3' sx={{ textAlign: 'center' }}>{t('title')}</Typography>
              <TextField type="text" value={location} onChange={handleLocationChange} placeholder={t('input')} sx={{ marginTop: 3 }} variant='standard' disabled={formDisabled} />
              <Button type="submit" sx={{ marginTop: 3 }} disabled={formDisabled}>{t('button')}</Button>
              <Typography sx={{ marginTop: 3, fontSize: 10, textAlign: 'center' }}>{t('caption')}</Typography>
              {displayFavorites ? (
                isAuthenticated ? (
                  <>
                    <Typography sx={{ display: 'flex', gap: 1, marginTop: 2 }} variant='h6'>
                      {t('favorites')}
                      <FavoriteIcon sx={{ color: '#be1931' }} />
                    </Typography>
                    {favorites.length > 0 ? (
                      favorites.map((data, index) => (
                        <Box key={index} sx={{ display: 'flex' }}>
                          <Typography onClick={() => handleFavoriteClick(data)} sx={{ cursor: 'pointer' }}>
                            - {data.city || data.archipelago || data.normalizedCity || data.state || data.country || data.continent || data.formatted} 
                            {displayFlag && data.flag ? ` ${data.flag}` : ''}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ textAlign: 'center', marginTop: 2 }} variant='subtitle2'>{t('favoritesMessage')}</Typography>
                    )}
                  </>
                ) : (
                  <Typography sx={{ textAlign: 'center', marginTop: 2 }} variant='subtitle2'>{t('favoritesLogin')}</Typography>
                )
              ) : null}
            </Paper>
          </Box>
        </form>
        {error && <Typography sx={{ textAlign: 'center', color: 'red', marginTop: 2 }} variant='h6'>{error}</Typography>}
        {weatherData && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ marginTop: 5, padding: 7, borderRadius: 7, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 3 }}>
              <Box sx={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                {displayFavorites && isAuthenticated && !isFavorite() && <IconButton onClick={handleFavorite}><FavoriteBorderIcon /></IconButton>}
                {displayFavorites && isAuthenticated && isFavorite() && <IconButton onClick={handleRemoveFavorite}><FavoriteIcon sx={{ color: '#be1931' }} /></IconButton>}
                <IconButton onClick={handleCardDelete}><CloseIcon /></IconButton>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
              {firstTime && (
                  <Typography variant='h6'>
                    {i18n.language === 'no' && firstTime}
                    {i18n.language === 'en' && firstTime}
                  </Typography>
              )}
                {displayFlag && city && <Typography variant='h4'>{t('weather')} {city}, {country} {flag}</Typography>}
                {displayFlag && archipelago && <Typography variant='h4'>{t('weather')} {archipelago}, {country} {flag}</Typography>}
                {displayFlag && !city && normalizedCity && <Typography variant='h4'>{t('weather')} {normalizedCity}, {country} {flag}</Typography>}
                {displayFlag && !city && !normalizedCity && !state && country && <Typography variant='h4'>{t('weather')} {country} {flag}</Typography>}
                {displayFlag && !city && !normalizedCity && state && <Typography variant='h4'>{('weather')} {state}, {country} {flag}</Typography>}
                {displayFlag && !city && !normalizedCity && !state && !country && continent && <Typography variant='h4'>{t('weather')} {continent} {flag}</Typography>}
                {displayFlag && !city && !normalizedCity && !state && !country && !continent && formatted && <Typography variant='h4'>{t('weather')} {formatted} {flag}</Typography>}
                {!displayFlag && city && <Typography variant='h4'>{t('weather')} {city}, {country}</Typography>}
                {!displayFlag && archipelago && <Typography variant='h4'>{t('weather')} {archipelago}, {country}</Typography>}
                {!displayFlag && !city && normalizedCity && <Typography variant='h4'>{t('weather')} {normalizedCity}, {country}</Typography>}
                {!displayFlag && !city && !normalizedCity && !state && country && <Typography variant='h4'>{t('weather')} {country}</Typography>}
                {!displayFlag && !city && !normalizedCity && state && <Typography variant='h4'>{t('weather')} {state}, {country}</Typography>}
                {!displayFlag && !city && !normalizedCity && !state && !country && continent && <Typography variant='h4'>{t('weather')} {continent}</Typography>}
                {!displayFlag && !city && !normalizedCity && !state && !country && !continent && formatted && <Typography variant='h4'>{t('weather')} {formatted}</Typography>}
              </Box>
              <Box sx={{ height: 100, width: 100, marginTop: 2 }}>
                <img src={symbolMapping[weatherData.properties.timeseries[0].data.next_1_hours.summary.symbol_code]} alt='Weather symbol' />
              </Box>
              <Typography sx={{ marginTop: 1 }} variant='h4'>{temperature} {unit}</Typography>
              <FormControl>
                <RadioGroup row value={unit} onChange={handleUnitChange} sx={{ marginTop: 2 }}>
                  <FormControlLabel value='˚C' control={<Radio />} label='Celsius' />
                  <FormControlLabel value='˚F' control={<Radio />} label='Fahrenheit' />
                </RadioGroup>
              </FormControl>
              {secondTime && (
                <div>
                  <Typography variant='h6' sx={{ marginTop: 4 }}>
                    {i18n.language === 'no' && secondTime}
                    {i18n.language === 'en' && secondTime}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Typography variant='h5'>{secondTemperature} {unit}</Typography>
                    <img src={symbolMapping[weatherData.properties.timeseries[1].data.next_1_hours.summary.symbol_code]} alt='Weather symbol' style={{ height: 64, width: 64 }}/>
                  </Box>
                </div>
              )}
              {thirdTime && (
                <div>
                  <Typography variant='h6' sx={{ marginTop: 4 }}>
                    {i18n.language === 'no' && thirdTime}
                    {i18n.language === 'en' && thirdTime}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Typography variant='h5'>{thirdTemperature} {unit}</Typography>
                    <img src={symbolMapping[weatherData.properties.timeseries[2].data.next_1_hours.summary.symbol_code]} alt='Weather symbol' style={{ height: 64, width: 64 }}/>
                  </Box>
                </div>
              )}
            </Paper>
          </Box>
        )}
        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant='caption'>{t('data')}</Typography>
          <Typography sx={{ marginBottom: 2 }} variant='caption'>{t('credit')} <a href='https://sundehakon.tech/' target='_blank' rel='noreferrer' style={{ color: isLightMode ? 'black' : 'white' }}>Håkon Sunde</a></Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginBottom: 5 }}>
            <a href='https://github.com/sundehakon' target='_blank' rel='noreferrer'>
              {!isLightMode && <img src='/images/svgrepo-github-white.png' alt='GitHub logo' style={{ height: 32, width: 32 }} />}
              {isLightMode && <img src='/images/github-logo.png' alt='GitHub logo' style={{ height: 32, width: 32 }} />}
            </a>
            <a href='https://twitter.com/lordsunde' target='_blank' rel='noreferrer'><img src='https://raw.githubusercontent.com/jmnote/z-icons/master/svg/twitter.svg' alt='Twitter logo' style={{ height: 32, width: 32 }} /></a>
          </Box>
        </Box>
      </Box>
      <SettingsModal open={open} handleClose={handleClose} displayFlag={displayFlag} setDisplayFlag={setDisplayFlag} displayFavorites={displayFavorites} setDisplayFavorites={setDisplayFavorites}/>
    </div>
  );
}

export default WeatherSearch;