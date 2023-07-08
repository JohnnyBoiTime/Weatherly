import react, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

// Main function to make the weather screen
const WeatherScreen = () => {
    const [weatherData, setWeatherData] = useState(null);
  
    useEffect(() => {
      // API Key
      const apiKey = '36f14a7fb96cee69a613ad66ad705822';
      
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=47.6&lon=-122.33&appid=${apiKey}&units=imperial`;
  
      axios.get(apiUrl)
        .then(response => {
          setWeatherData(response.data);
        })
        .catch(error => {
          console.log('Error fetching weather data', error);
        });
    }, []);
  
    if (!weatherData) {
      return <Text>Loading</Text>
    }

    if (!weatherData.name) {
      return <Text>Error! Cannot retrieve name</Text>
    }

    return (
      <View style={styles.container}>
        <Text>City: {weatherData.name}</Text>
        <Text>Temperature: {weatherData.main.temp}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    city: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
  });

  export default WeatherScreen;