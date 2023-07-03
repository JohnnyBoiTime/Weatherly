import react, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const WeatherScreen = () => {
    const [weatherData, setWeatherData] = useState(null);
  
    useEffect(() => {
      // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
      const apiKey = '36f14a7fb96cee69a613ad66ad705822';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${apiKey}`;
  
      axios.get(apiUrl)
        .then(response => {
          setWeatherData(response.data);
        })
        .catch(error => {
          console.log('Error fetching weather data', error);
        });
    }, []);
  
    return (
      <View>
        {weatherData ? (
          <View>
            <Text>City: {weatherData.name}</Text>
            <Text>Temperature: {weatherData.main.temp}</Text>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    );
  };
  
  export default WeatherScreen;