import react, { useEffect, useState } from 'react';
import { Button, View, TextInput, Text, StyleSheet } from 'react-native';
import axios from 'axios';


// Main function to make the weather screen
const WeatherScreen = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);

      const apiKey = '36f14a7fb96cee69a613ad66ad705822';
  
    const getWeatherData = () =>{
      
      setLoading(true);
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  
      axios.get(apiUrl)
        .then(response => {
          setWeatherData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.log('Error fetching weather data', error);
          setLoading(false);
        });
    };

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.TextInput}
          placeholder='Enter City'
          value={city}
          onChangeText={text=>setCity(text)}
          />
        <Button title="Get Weather" onPress={getWeatherData} />  
        {loading && <Text>Loading....</Text>}
        {weatherData && (
          <View>
            <Text>City: {weatherData.name}</Text>
        <Text>Temperature: {weatherData.main.temp}</Text>
          </View>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputBox: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
  });

  export default WeatherScreen;