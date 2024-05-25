import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../App.css';
import { Button, Typography, Paper, Box, RadioGroup, FormControl, FormControlLabel, Radio, IconButton } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { symbolMapping } from './SymbolMapping';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({ displayFlag, displayFavorites }) => {
const [latitude, setLatitude] = useState(0);
const [longitude, setLongitude] = useState(0);
const [weatherData, setWeatherData] = useState(null);
const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });
const [country, setCountry] = useState(null);
const [flag, setFlag] = useState(null);
const [error, setError] = useState(null);
const [city, setCity] = useState(null);
const [archipelago, setArchipelago] = useState(null);
const [normalizedCity, setNormalizedCity] = useState(null);
const [state, setState] = useState(null);
const [continent, setContinent] = useState(null);
const [formatted, setFormatted] = useState(null);
const [unit, setUnit] = useState('˚C');
const [temperature, setTemperature] = useState(0);
const [secondTemperature, setSecondTemperature] = useState(0);
const [thirdTemperature, setThirdTemperature] = useState(0);
const [markers, setMarkers] = useState([]);
const [selected, setSelected] = useState(null);
const [favorites, setFavorites] = useState([]);
const [localTime, setLocalTime] = useState(null);
const [firstTime, setFirstTime] = useState(null);
const [secondTime, setSecondTime] = useState(null);
const [thirdTime, setThirdTime] = useState(null);
const { t } = useTranslation();
const { user, isAuthenticated } = useAuth0();

useEffect(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const localISOTime = now.toISOString().slice(0, 19) + 'Z';
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
    setMapCenter({ lat: latitude, lng: longitude });
}, [latitude, longitude]);

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

const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, handleLocationFetchError);
    } else {
    console.log('Geolocation not supported');
    }
};

const success = (position) => {
    const latitudeData = position.coords.latitude;
    const longitudeData = position.coords.longitude;
    setLatitude(latitudeData);
    setLongitude(longitudeData);
    setMarkers([{ lat: latitudeData, lng: longitudeData }]);
    setSelected({ lat: latitudeData, lng: longitudeData });
    console.log(selected.latitude);
    console.log(selected.longitude);
    handleFormSubmit(latitudeData, longitudeData);
};

const handleLocationFetchError = (error) => {
    console.error('Error occurred while retrieving geolocation:', error);
};

const handleFormSubmit = useCallback(async (lat, lng) => {
    try {
    const geocodingResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lng}&key=${process.env.REACT_APP_OPENCAGEDATA_API_KEY}`);
    const weatherResponse = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lng}`);
    const newWeatherData = weatherResponse.data;
    setWeatherData(newWeatherData);

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
    }
    } catch (error) {
    console.error('Error fetching weather data:', error);
    }
}, [localTime]);

const onMapClick = useCallback((event) => {
    setMarkers([]);
    const newMarker = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
    time: new Date(),
    };

    setMarkers((current) => [...current, newMarker]);
    setSelected(newMarker);

    handleFormSubmit(newMarker.lat, newMarker.lng);
}, [handleFormSubmit]);  

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

const isFavorite = () => {
    return favorites.some(favorite =>
    favorite.lat === weatherData.geometry.coordinates[1] && favorite.lon === weatherData.geometry.coordinates[0]
    );
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
};

return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 1 }}>
        <Box sx={{ marginBottom: 2 }}>
            <Button onClick={fetchCurrentLocation}>
                Use My Location 
            </Button>
        </Box>
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
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(30, 30),
                    }}
                />
                ))}
            </GoogleMap>
            </Box>
        </LoadScript>
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
                    {displayFlag && city && <Typography variant='h4'>{t('weather')} {city}, {country} {flag}</Typography>}
                    {displayFlag && archipelago && <Typography variant='h4'>{t('weather')} {archipelago}, {country} {flag}</Typography>}
                    {displayFlag && !city && normalizedCity && <Typography variant='h4'>{t('weather')} {normalizedCity}, {country} {flag}</Typography>}
                    {displayFlag && !city && !normalizedCity && !state && country && <Typography variant='h4'>{t('weather')} {country} {flag}</Typography>}
                    {displayFlag && !city && !normalizedCity && state && <Typography variant='h4'>{t('weather')} {state}, {country} {flag}</Typography>}
                    {displayFlag && !city && !normalizedCity && !state && !country && continent && <Typography variant='h4'>{t('weather')} {continent} {flag}</Typography>}
                    {displayFlag && !city && !normalizedCity && !state && !country && !continent && formatted && <Typography variant='h4'>{t('weather')} {formatted} {flag}</Typography>}
                    {!displayFlag && city && <Typography variant='h4'>{t('weather')} {city}, {country}</Typography>}
                    {!displayFlag && archipelago && <Typography variant='h4'>{t('weather')} {archipelago}, {country}</Typography>}
                    {!displayFlag && !city && normalizedCity && <Typography variant='h4'>{t('weather')} {normalizedCity}, {country}</Typography>}
                    {!displayFlag && !city && !normalizedCity && !state && country && <Typography variant='h4'>{t('weather')} {country}</Typography>}
                    {!displayFlag && !city && !normalizedCity && state && <Typography variant='h4'>{t('weather')} {state}, {country}</Typography>}
                    {!displayFlag && !city && !normalizedCity && !state && !country && continent && <Typography variant='h4'>{t('weather')} {continent}</Typography>}
                    {!displayFlag && !city && !normalizedCity && !state && !country && !continent && formatted && <Typography variant='h4'>{t('weather')} {formatted}</Typography>}
                    {firstTime && (
                    <Typography variant='h5' sx={{ marginTop: 2 }}>
                        {new Date(firstTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </Typography>
                    )}
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
                    <Typography variant='h5' sx={{ marginTop: 4, marginBottom: 1, textAlign: 'center'}}>
                        {new Date(secondTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Typography>{secondTemperature} {unit}</Typography>
                        <img src={symbolMapping[weatherData.properties.timeseries[1].data.next_1_hours.summary.symbol_code]} alt='Weather symbol' style={{ height: 64, width: 64 }}/>
                    </Box>
                    </div>
                )}
                {thirdTime && (
                    <div>
                    <Typography variant='h5' sx={{ marginTop: 4, marginBottom: 1, textAlign: 'center' }}>
                        {new Date(thirdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Typography>{thirdTemperature} {unit}</Typography>
                        <img src={symbolMapping[weatherData.properties.timeseries[2].data.next_1_hours.summary.symbol_code]} alt='Weather symbol' style={{ height: 64, width: 64 }}/>
                    </Box>
                    </div>
                )}
            </Paper>
        </Box>
        )}
        </Box>
    );
};

export default Map;
