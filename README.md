# WeatherApp

This is a simple weather application built with React and Material UI. It uses the OpenCage and YR APIs to fetch weather data based on the user's input location.

## Check It Out!
https://sundeweather.netlify.app/

## Features

- User authentication with Auth0
- Fetches and displays weather data for a given location
- Displays the country flag and city name for the given location
- Shows the current temperature and weather symbol

## Installation

1. Clone this repository
2. Install the dependencies with `npm install`
3. Create a `.env` file in the root directory and add your OpenCage API key as `REACT_APP_OPENCAGEDATA_API_KEY`
4. Run the app with `npm start`

## Usage

1. If not authenticated, click the login button to authenticate.
2. Enter a location in the text field and click "Get Weather".
3. The app will display the current weather for the given location.

## Dependencies

- React
- Axios
- Material UI
- Auth0

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT