import React, { useState } from 'react';
import { ImageBackground, FlatList, Button, View,  ScrollView, TextInput, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';


// Main function to make the weather screen
const WeatherScreen = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [citySearch, setCitySearch] = useState([]);


    const apiKey = '36f14a7fb96cee69a613ad66ad705822';
  
    const search = (query) => {
      setCity(query);
        if (query) {
          const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=20&appid=${apiKey}`;
        
        axios.get(apiUrl)
        .then(response => {
          const cities = response.data.map(cityItem => ({ 
            name: cityItem.name,
            state: cityItem.state,
            country: cityItem.country,
          }));
          setCitySearch(cities);
          setLoading(false);
        })
        .catch(error => {
          console.log('Could not get city data', error);
          setLoading(false);
        });
      }
      else {
        setCitySearch([]);
      }
    };

    const selectCity = (selectedCity) => {
      setCity(selectedCity.name);
      setCitySearch([]);
    }

    const getWeatherData = () => {
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
        <ImageBackground 
          source={require('./assets/weatherBG.jpg')}
          style={styles.img}
        >
        <TextInput
          style={styles.inputBox}
          placeholder='Enter City Name'
          placeholderTextColor='blue'
          value={city}
          onChangeText={search}
          />
        <FlatList 
          data={citySearch}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => selectCity(item)}>
              <Text styles={styles.dropdownItem}>{item.name}, {item.state}, {item.country}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
          style={styles.dropdown}
          />
        <Button title="Get Weather" onPress={getWeatherData} />  
        {loading && <Text>Loading....</Text>}
        {weatherData && (
          <View>
            <Text>City: {weatherData.city.name}</Text>
            <Text>Forecast for the next 7 days: {"\n"} </Text>
            <ScrollView style={styles.scroller} bounces='false'>
              {weatherData.list.slice(0,45).map((item, index) => {
                const forecastDate = new Date(item.dt_txt.split(' ')[0]);
                const dayOfWeek = forecastDate.toLocaleDateString('en-US', {weekday: 'long'});
                if (index == 0) {
                  return (
                    <Text key={index}>
                      {dayOfWeek.split(',')[0]}:
                    </Text>
                  );
                }
                else if (item.dt_txt.split(' ')[1] == '00:00:00') {
                  return (
                    <Text key={index}>
                      {dayOfWeek.split(',')[0]}: {"\n"}{item.dt_txt.split(' ')[1]}: {item.main.temp}, {item.weather[0].description}
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
            </ScrollView>
          </View>
        )}
        </ImageBackground>  
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
      textAlign: 'center',
      width: "90%",
      height: 40,
      borderColor: 'black',
      margin: 12,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      color: 'black',
    },
    scroller: {
      marginTop: 10,
      marginVertical: 200,
    },
    img: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    dropdown: {
      maxHeight: 200,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 8,
    },
    dropdownItem: {
      paddingVertical: 8,
    },
  });

  export default WeatherScreen;