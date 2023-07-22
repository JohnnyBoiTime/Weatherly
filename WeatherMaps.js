import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';

import axios from 'axios';

// CHANGE VARIABLE NAMES AND STRUCTURE BEFORE PUSHING TO GITHUB!

// Weathermap
const WeatherMap = () => {
  
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });



  const API_KEY = '5e577bade8b344a313e992eff091dd6b'; // HIDE

  const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'; // API URL

  // Gets weather from api
  useEffect(() => {
    const fetchWeather = async () => {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          lat: markerCoordinate.latitude,
          lon: markerCoordinate.longitude,
          appid: API_KEY,
          units: 'imperial',
        },
      });
      setWeatherData(response.data);
    };

    fetchWeather();
  }, [markerCoordinate]);
  
  // Changes weather layer
  const weatherMapLayers = [
    {
      id: 'clouds',
      url: 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=5e577bade8b344a313e992eff091dd6b',
    },
    {
      id: 'precipitation',
      url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=5e577bade8b344a313e992eff091dd6b',
    },
    {
      id: 'temperature',
      url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=5e577bade8b344a313e992eff091dd6b',
    },
    {
      id: 'wind',
      url: 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=5e577bade8b344a313e992eff091dd6b',
    },
  ];

  // State for layers
  const [selectedLayer, setSelectedLayer] = useState(weatherMapLayers[0].id);

  // Makes map grayer to more easily see layers
  const grayscaleStyle = [
    {
      elementType: 'all',
      stylers: [
        {
          saturation: -100,
        },
        {
          hue: '#000000',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>

      {/*Map provided by google*/}
      <MapView
      provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{ 
          latitude: markerCoordinate.latitude,
          longitude: markerCoordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={grayscaleStyle}
        onPress={(e) => setMarkerCoordinate(e.nativeEvent.coordinate)}
      >
  
        {/* Displays Layers */}
        <UrlTile
          key={selectedLayer}
          urlTemplate={weatherMapLayers.find((layer) => layer.id === selectedLayer).url}
        />
      </MapView>
      
      {/*Buttons to choose which layer to display*/}
      <View style={styles.buttonContainer}>
        {weatherMapLayers.map((layer) => (
          <TouchableOpacity
            key={layer.id}
            style={[
              styles.layerButton,
              selectedLayer === layer.id && styles.selectedLayerButton,
            ]}
            onPress={() => setSelectedLayer(layer.id)}
          >
            <Text style={styles.buttonText}>{layer.id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  weatherContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 8,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  layerButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedLayerButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default WeatherMap;