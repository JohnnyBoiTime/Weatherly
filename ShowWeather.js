import React, { useState, useContext } from 'react';
import { ImageBackground, Button, FlatList, View,  ScrollView, TextInput, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Main function to make the weather screen
const WeatherScreen = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showList, setShowList] = useState(false);
    const [citySearch, setCitySearch] = useState([]);
    const [savedCities, setSavedCities] = useState([]);
    const [citySave, setCitySave] = useState([]);

    const apiKey = '36f14a7fb96cee69a613ad66ad705822';
  
    const search = (query) => {
      setCity(query);
      selectCity([]);
      setCitySearch([]);

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
          setShowList(true);
        })
        .catch(error => {
          console.log('Could not get city data', error);
          setLoading(false);
          setShowList(false);
        });
      }
      else {
        setCitySearch([]);
        setShowList(false);
      }
    };

    const changeText = (text) => {
      setCity(text);
    };

    const backspace = () => {
      setCity(city.slice(0, -1));
    };

    const addCity = (city) => {
      if (!city || !city || savedCities.some(savedCity => savedCity.name === city.name)) {
        return;
      } 
        setSavedCities([...savedCities, city]);
    };

    const selectCity = (selectedCity) => {
      setCity(selectedCity.name);
      setCitySave(selectedCity);
      setCitySearch([]);
      setShowList(false);
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity.name},${selectedCity.state},${selectedCity.country}&appid=${apiKey}&units=imperial`;
      getWeatherData(apiUrl);
    };

    const weatherBackgrounds = {
      'overcast clouds': require('./assets/overcast.jpg'),
      'broken clouds': require('./assets/brokenClouds.jpg'),
      'clear sky': require('./assets/clearSkies.jpg'),
      'light rain': require('./assets/lightRain.jpg'),
    };

    const getWeatherData = (theApiUrl) => {
    setLoading(true);
  
    axios.get(theApiUrl)
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
          <View>
            <Text>Saved Cities: </Text>
            <FlatList
            data={savedCities}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => selectCity(item)}>
                <Text>{item.name}, {item.country}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item)=>item.name}
            />
          </View>
          <View>
          {showList && (
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
          )}
        </View>
        {loading && city &&<Text>Getting Results...</Text>}
        {weatherData && (
          <View style={styles.container}>
            {city && (
            <ImageBackground style={styles.img} source={weatherBackgrounds[weatherData.list[0].weather[0].description]}>
            <Text>City: {weatherData.city.name}, {weatherData.city.country}</Text>
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
            <Button title="Save" onPress={() => addCity({ name: weatherData.city.name, state: weatherData.city.state, country: weatherData.city.country })}></Button>
            </ImageBackground>
            )}
          </View>
        )}
        </ImageBackground>  
      </View>
    );
  };

  
export default WeatherScreen;

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



