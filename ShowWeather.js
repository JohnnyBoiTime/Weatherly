import React, { useState, useEffect } from 'react';
import { ImageBackground, Button, FlatList, View,  ScrollView, TextInput, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment-timezone';

// Main function to make the weather screen
const WeatherScreen = () => {
    const [city, setCity] = useState(''); // States to set city
    const [weatherData, setWeatherData] = useState(null); // States for weather data
    const [showList, setShowList] = useState(false); // State to show list of cities
    const [citySearch, setCitySearch] = useState([]); // States to search cities
    const [savedCities, setSavedCities] = useState([]); // States to save cities
    const [currentWeatherData, setCurrentWeatherData] = useState(null);

    const apiKey = '5e577bade8b344a313e992eff091dd6b'; // API Key (Will hide later)
  
    // Function to search a city
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
            setShowList(true);
          })
          .catch(error => {
            console.log('Could not get city data', error);
            setShowList(false);
          });
      }
      else {
        setCitySearch([]);
        setShowList(false);
      }
    };


    // Adds city to a saved list
    const addCity = (city) => {
      if (!city || !city || savedCities.some(savedCity => savedCity.name === city.name)) {
        return;
      } 
        setSavedCities([...savedCities, city]);
        saveCitiesToStorage([...savedCities, city]);
    };
    
    // Removes city from the saved list
    const removeCity = (city) => {
      setSavedCities(savedCities.filter(savedCity => savedCity.name !== city.name));
    }

    // Stores saved city list in async storage
    const saveCitiesToStorage = async (cities) => {
      try {
        const jsonVal = JSON.stringify(cities);
        await AsyncStorage.setItem('savedCities', jsonVal);
      } catch (error) {
        console.log('Error! cannot save data to Async!, Error:', error);
      }
    };

    // Retrieves saved city list from async storage
    const retrieveCities = async () => {
      try {
        const jsonVal = await AsyncStorage.getItem('savedCities');
        const cities = jsonVal != null ? JSON.parse(jsonVal) : [];
        setSavedCities(cities);
      } catch (error) {
        console.log('Could not retrieve data! Error:', error);
      }
    };

    // Checks to see if the city is saved
    const isCitySaved = (city) => {
      return savedCities.some(savedCity => 
        savedCity.name === city.name &&
        savedCity.state === city.state &&
        savedCity.country === city.country
      );
    };

    // Selects the city
    const selectCity = (selectedCity) => {
      setCity(selectedCity.name);
      setCitySearch([]);
      setShowList(false);
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity.name},${selectedCity.state},${selectedCity.country}&appid=${apiKey}&units=imperial`;
      getWeatherData(apiUrl);
    };


    // Bakcground changes based on current weather
    const weatherBackgrounds = {
      'overcast clouds': require('./assets/overcast.jpg'),
      'broken clouds': require('./assets/brokenClouds.jpg'),
      'clear sky': require('./assets/clearSkies.jpg'),
      'light rain': require('./assets/lightRain.jpg'),
    };

    const times = {
      '00:00:00': '6 PM',
      '03:00:00': '9 PM',
      '06:00:00': '12 AM',
      '09:00:00': '3 AM',
      '12:00:00': '6 AM',
      '15:00:00': '9 AM',
      '18:00:00': '12 PM',
      '21:00:00': '3 PM',
    };

    // Function to get the weather data
    const getWeatherData = (theApiUrl) => {
      axios.get(theApiUrl)
        .then(response => {
          console.log(response.data);
          setWeatherData(response.data);
        })
        .catch(error => {
          console.log('Error fetching weather data', error);
        });
    };

    
      axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=47.6694&lon=-122.1239&appid=5e577bade8b344a313e992eff091dd6b&units=imperial')
        .then(response => {
          setCurrentWeatherData(response.data);
        })
        .catch(error => {
          console.log('Error fetching weather data', error);
        });
        
    // Retrieves cities
    useEffect(() => {
      retrieveCities();
    }, []);

    const convert = (time) => {
      const myTime = moment(time).tz(moment.tz.guess());
      return myTime.format('YYYY-MM-DD HH:mm:ss');
    }

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
        {city && <Text></Text>}
        {weatherData && city &&(
          <View style={styles.container}>
            <ImageBackground style={styles.img} source={weatherBackgrounds[weatherData.list[0].weather[0].description]}>
            <Text>City: {weatherData.city.name}, {weatherData.city.country}, ({weatherData.city.coord.lat}, {weatherData.city.coord.lon})</Text>
            <Text>Forecast for the next 7 days: {"\n"} </Text>
            <ScrollView style={styles.scroller} bounces='false'>
              {weatherData.list.map((item, index) => {
                const theTime = convert(item.dt_txt);
                const forecastDate = moment(item.dt_txt.split(' ')[0]).tz(moment.tz.guess());
                const dayOfWeek = forecastDate.format('dddd');
                if (index == 0) {
                  return (
                    <Text key={index}>
                      {dayOfWeek}: {"\n"}{times[theTime.split(' ')[1]]}: {item.main.temp}, {item.weather[0].description}
                    </Text>
                  );
                }
                else if (times[theTime.split(' ')[1]] == '12 AM') {
                  return (
                    <Text key={index}>
                      {dayOfWeek}: {"\n"}{times[theTime.split(' ')[1]]}: {item.main.temp}, {item.weather[0].description}
                    </Text>
                  )
                }
                else {
                  return (
                    <Text key={index}>
                      {times[theTime.split(' ')[1]]}: {item.main.temp}, {item.weather[0].description}
                    </Text>
                  )
                }
            })}
            </ScrollView>
            {!isCitySaved({ name: weatherData.city.name, state: weatherData.city.state, country: weatherData.city.country}) ? (
            <Button title="Save" onPress={() => addCity({ name: weatherData.city.name, state: weatherData.city.state, country: weatherData.city.country })}></Button>
            ) : (
            <Button title="Remove" onPress={() => removeCity({ name: weatherData.city.name, state: weatherData.city.state, country: weatherData.city.country })}></Button>
              )}
            </ImageBackground>
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
      margin: 10,
      marginTop: 50,
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



