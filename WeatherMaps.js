import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';

// Weathermap
const WeatherMap = () => {

  const apiKey = 'HIDDEN';
  
  // Changes weather layer
  const weatherMapLayers = [
    {
      id: 'clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    },
    {
      id: 'precipitation',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    },
    {
      id: 'temperature',
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    },
    {
      id: 'wind',
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
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

  const cloudLegend = () => {
    return (
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: 'blue'}]}/>
          <Text>Clear</Text>
        </View>
      </View>
      );
  };

  return (
    <View style={styles.container}>

      {/*Map provided by google*/}
      <MapView
      provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={grayscaleStyle}
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 20,
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
