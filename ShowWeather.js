import react, { useEffect, useState } from 'react';
import { Button, View, SafeAreaView, ScrollView, TextInput, Text, StyleSheet } from 'react-native';
import axios from 'axios';


// Main function to make the weather screen
const WeatherScreen = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiKey = '36f14a7fb96cee69a613ad66ad705822';
  
    const getWeatherData = () =>{
    setLoading(true);
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
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
          style={styles.inputBox}
          placeholder='Enter City Name'
          value={city}
          onChangeText={text=>setCity(text)}
          />
        <Button title="Get Weather" onPress={getWeatherData} />  
        {loading && <Text>Loading....</Text>}
        {weatherData && (
          <View>
            <Text>City: {weatherData.city.name}</Text>
            <Text>Forecast for the next 7 days: {"\n"} </Text>
            <View>
              {weatherData.list.slice(0,7).map((item, index) => {
                const forecastDate = new Date(item.dt_txt.split(' ')[0]);
                const dayOfWeek = forecastDate.toLocaleDateString('en-US', {weekday: 'long'});
                if (index === 0) {
                  return (
                    <Text key={index}>
                      {dayOfWeek.split(',')[0]}:
                    </Text>
                  );
                }
                else if (item.dt_txt.split(' ')[1] == '00:00:00') {
                  return (
                    <Text key={index}>
                      {dayOfWeek.split(',')[0]}: {"\n"} {item.dt_txt.split(' ')[1]}: {item.main.temp}, {item.weather[0].description}
                    </Text>
                  )
                }
                else {
                  return (
                    <Text key={index}>
                      {item.dt_txt.split(' ')[1]}: {item.main.temp}, {item.weather[0].description}
                    </Text>
                  )
                }
            })} 
            </View>
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
      width: "50%",
      borderColor: 'black',
      margin: 12,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
    },
    scrollView: {
      marginHorizontal: 20,
    }
  });

  export default WeatherScreen;