import React, { useState, useEffect } from 'react';
import { ImageBackground, Button, FlatList, View, TextInput, Text, StyleSheet,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ScrollView, NativeBaseProvider, Box, Divider, Heading } from 'native-base';
import moment, { unix } from 'moment-timezone';


// ADD CURRENT WEATHER!!!!


// Main function to make the weather screen
const WeatherScreen = () => {
    const [city, setCity] = useState(''); // States to set city
    const [weatherData, setWeatherData] = useState(null); // States for weather data
    const [currentWeather, setCurrentWeather] = useState(null);
    const [showList, setShowList] = useState(false); // State to show list of cities
    const [citySearch, setCitySearch] = useState([]); // States to search cities
    const [savedCities, setSavedCities] = useState([]); // States to save cities
    const [isCityFound, setIsCityFound] = useState(false); // States to see if city was found in the database

    const apiKey = '5e577bade8b344a313e992eff091dd6b'; // API Key (Will hide later)
    const ip = '10.109.213.149'; // ip

    // Querying a city
    const search = (query) => {
      setCity(query);
      selectCity([]);
      setCitySearch([]);

        if (query) {
          const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=20&appid=${apiKey}`; 
          axios.get(apiUrl)
          .then(response => {
            // Mapping information from response to search for the city
            const cities = response.data.map(cityItem => ({ 
              name: cityItem.name,
              state: cityItem.state,
              country: cityItem.country, 
              lat: cityItem.lat,
              lon: cityItem.lon,
            }));
            // We have city data from api response
            setCitySearch(cities);
            setShowList(true);
          })

          // We had a problem getting the city data
          .catch(error => {
            console.log('Could not get city data', error);
            setShowList(false);
          });
      }
      else {
        // We have no city data
        setCitySearch([]);
        setShowList(false);
      }
    };

  // Extracts desired information from API response,
  // inserts information into database
const insertCityToDatabase = async (weatherData) => {

  try {
    
    // Takes city data from parameters
    const cityData = {
      time: weatherData.list.map(item => item.dt_txt.split(' ')[1]),
      city_name: weatherData.city.name,
      city_country: weatherData.city.country,
      city_lon: weatherData.city.coord.lon,
      city_lat: weatherData.city.coord.lat,
      temp: weatherData.list.map(item => item.main.temp),
      weather_desc: weatherData.list.map(item => item.weather[0].description),
    };

    // Seperates city data into respective fields
    const {time, city_name, city_country, city_lon, city_lat, temp, weather_desc} = cityData;

    // City data added to database 
    for (let i = 0; i < time.length; i++) {
      const city = {
        time: time[i], // with a wide range of data, time changes, thus we iterate through every time value from data
        city_name,
        city_country,
        city_lon,
        city_lat,
        temp: temp[i], // Same concept as time
        weather_desc: weather_desc[i], // Same concept as time
      };

      // Everything was succesfull
      await axios.post(`http://${ip}:3000/api/add_cities`, city); 

    }

    // Info to remember specific city by
    const citySpecifics = {
      name: cityData.city_name,
      country: cityData.city_country,
      lon: cityData.city_lon,
      lat: cityData.city_lat,
    };

    // Visible list on weather screen
    setSavedCities([...savedCities, citySpecifics]);
    setIsCityFound(false);
    console.log('City inserted successfully!');

    // City was not inserted correctly
  } catch (error) {
    console.error('Error inserting city!', error);
  }
};

  // Deletes cities based on name
  const deleteCities = async (cityName) => {
    try {
      const response = await axios.delete(`http://${ip}:3000/api/delete_cities`, {
        data: { city_name: cityName },
      });
  
      console.log(response.data.message);

      // Remove saved city from visible list
      setSavedCities(savedCities.filter(savedCity => savedCity.name !== cityName));
      setIsCityFound(true);

    // Could not delete city
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  // Find a city in the database
  const searchDatabase = async (weatherData) => {
    try {
      const response = await fetch(`http://${ip}:3000/api/search_city?city_name=${weatherData.city.name}&city_lon=${weatherData.city.coord.lon}&city_lat=${weatherData.city.coord.lat}`);
      const data = await response.json();

      // Is there actual data found?
      if (data.length > 0) { 
        console.log("City Found!");
        setIsCityFound(false);
      }
      // There was no data found
      else {
        setIsCityFound(true);
      }

    // Could not find city
    } catch (error) {
      console.error('Error searching for city:', error);
    }
  };

  // Grabs city if it exists in the databse
  const grabFromDatabase = async () => {
    try {
      const response = await axios.get(`http://${ip}:3000/api/fetch_cities`);
      const cities = response.data; 

      // Selectively picks defining info for the city
      const citySpecifics = cities.map(citiesInfo => ({
        name: citiesInfo.city_name,
        country: citiesInfo.city_country,
        lat: citiesInfo.city_lat,
        lon: citiesInfo.city_lon,
      }));

      console.log(citySpecifics);

      // Does the city already exist in the datbase?
      if (cities.length === 0) {
        console.log('No cities found in database!');
      
      // it does, so grab it
      } else {
        setSavedCities(citySpecifics);
      }
    
    // Could not fetch the city
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };
  
    // Selects the city
    const selectCity = (selectedCity) => {
      setCity(selectedCity.name);
      setShowList(false);
      const futureWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}&units=imperial`;
      const currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}&units=imperial`;
      getTheCurrentWeatherData(currentWeather);
      getWeatherData(futureWeather);
    };

    // Bakcground changes based on current weather
    const weatherBackgrounds = {
      'overcast clouds': require('./assets/overcast.jpg'),
      'broken clouds': require('./assets/brokenClouds.jpg'),
      'clear sky': require('./assets/clearSkies.jpg'),
      'light rain': require('./assets/lightRain.jpg'),
    };

    // Converts military time to regular
    const times = {
      '00:00:00': '12 AM',
      '01:00:00': '1 AM',
      '02:00:00': '2 AM',
      '03:00:00': '3 AM',
      '04:00:00': '4 AM',
      '05:00:00': '5 AM',
      '06:00:00': '6 AM',
      '07:00:00': '7 AM',
      '08:00:00': '8 AM',
      '09:00:00': '9 AM',
      '10:00:00': '10 AM',
      '11:00:00': '11 AM',
      '12:00:00': '12 PM',
      '13:00:00': '1 PM',
      '14:00:00': '2 PM',
      '15:00:00': '3 PM',
      '16:00:00': '4 PM',
      '17:00:00': '5 PM',
      '18:00:00': '6 PM',
      '19:00:00': '7 PM',
      '20:00:00': '8 PM',
      '21:00:00': '9 PM',
      '22:00:00': '10 PM',
      '23:00:00': '11 PM',
    };

    // Function to get the weather data
    const getWeatherData = (theApiUrl) => {
      axios.get(theApiUrl)
        .then(response => {
          setWeatherData(response.data);
          searchDatabase(response.data);
        })
        .catch(error => {
          console.log('Error fetching weather data', error);
        });
    };

    // Function to get the current weather data
    const getTheCurrentWeatherData = (theApiUrl) => {
      axios.get(theApiUrl)
        .then(response => {
          setCurrentWeather(response.data);
          console.log(response.data);
          searchDatabase(response.data);
        })
        .catch(error => {
          console.log('Error fetching weather data', error);
        });
    };

    // Converts the time to local time, considers offset
    const convert = (time, offset) => {
      const myTime = moment(time).utcOffset(offset);
      return myTime.format('YYYY-MM-DD HH:mm:ss');
    };

    useEffect(() => {
      grabFromDatabase();
    }, []);
    
    return (
      <View style={styles.container}>

      {/*Background for the app*/ }
        <ImageBackground 
          source={require('./assets/weatherBG.jpg')}
          style={styles.img}
        >

          {/* Text input box for searching the weather */}
        <TextInput
          style={styles.inputBox}
          placeholder='Enter City Name'
          placeholderTextColor='blue'
          value={city}
          onChangeText={search}
          />
          <View>
            {/* List of saved cities pulled from database, uses a flatlist */}
            <Text>Saved Cities: </Text>
            <FlatList
            data={savedCities}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => selectCity(item)}>
                <Text>{item.name}, {item.country}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.name}
            />
          </View>
          <View>
          {/* Flatlist for searching and displaying cities for user to select */}
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

        {/* Displays weather to the screen after user selects a valid city */}
        {weatherData && city && currentWeather && (
          <NativeBaseProvider>
          <View style={styles.container}>
            {/* Changes image based on the current weather */}
            <ImageBackground style={styles.img} source={weatherBackgrounds[weatherData.list[0].weather[0].description]}>
            {/*Displays city information */}
            <Heading>City: {weatherData.city.name}, {weatherData.city.country}, ({weatherData.city.coord.lat}, {weatherData.city.coord.lon})</Heading>
            <Text>Forecast for the next 7 days: {"\n"} </Text>

            {/* Displays the forecast using a scrollview, maps information and iterates through all info to get
            the weather information */}
            <ScrollView style={styles.scroller} bounces='false'>
              {weatherData.list.map((item, index) => {
                const timeStamp = currentWeather.dt * 1000;
                const utc = new Date(timeStamp);
                const timeStampOffset = 4 * 60;
                const adjusted = new Date(utc.getTime() + timeStampOffset * 60 * 1000)
                const readableTime = adjusted.toISOString().substring(11,19);
                const forecastDate = moment(item.dt_txt.split(' ')[0]).tz(moment.tz.guess());
                const dayOfWeek = forecastDate.format('dddd');
                const theTime = convert(item.dt_txt, weatherData.city.timezone);
                if (index == 0) {
                  return (
                    <View key={index}>
                    <Text>
                    <Text>{dayOfWeek}:</Text>
                      {readableTime}: {currentWeather.main.temp}, {currentWeather.weather[0].main} {"\n"}
                      {theTime.split(' ')[1]}: {item.main.temp}, {item.weather[0].description}
                    </Text>
                  </View>
                  );
                }
                else if (theTime.split(' ')[1] == '23:00:00') {
                  return (
                    <View key={index}>
                      <Divider my="2" _light ={{
                      bg: "muted.800"
                    }} />
                        <Text >
                        <Text>{dayOfWeek}:</Text>
                          {theTime.split(' ')[1]}: {item.main.temp}, {item.weather[0].description}
                        </Text>
                      </View>
                  );
                }
                else {
                  return (
                        <Text key={index}>
                          {theTime.split(' ')[1]}: {item.main.temp}, {item.weather[0].description}
                        </Text>
                  );
                }
            })}
            </ScrollView>
            {/*Buttons for saving a city to the database */}
            {isCityFound ? (
            <Button title="Save" onPress={() => insertCityToDatabase(weatherData)}></Button>
            ) : (
            <Button title="Remove" onPress={() => deleteCities(weatherData.city.name)}></Button>
              )}
            </ImageBackground>
          </View>
          </NativeBaseProvider>
        )}
        </ImageBackground>  
      </View>
    );
  };

  
export default WeatherScreen;

// Styles
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
