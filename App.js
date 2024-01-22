import 'react-native-gesture-handler';
import * as React from 'react';
import {ImageBackground, Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigationBuilder, TabRouter} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherScreen from './ShowWeather';
import WeatherMap from './WeatherMaps';
import { NativeBaseProvider, Box } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

// Main app
export default function App() {
  return (
      <NavigationContainer> 
        <TabBottom.Navigator screenOptions={{headerShown: false, gestureDirection: 'horizontal', gestureResponseDistance: 1284}}>
        <TabBottom.Screen name="Current Weather" component={WeatherScreen}/>
        <TabBottom.Screen name="Maps" component={WeatherMap} />
        <TabBottom.Screen name="Credits" component={CreditScreen} />
      </TabBottom.Navigator>
      </NavigationContainer> 
  );
};

const Stack = createStackNavigator();

const TabBottom = createBottomTabNavigator();

// Credits
const CreditScreen = () => {
  return (
    <NativeBaseProvider>
      <LinearGradient
      colors = {['#800080', '#87ceeb']}
      locations={[0.1, 0.9]}
      style={{ flex: 1 }}
      >
        <Box alignSelf="center" paddingTop={300}>
        <View>
          <Text styles={styles.container}>Made by Philip Rickey</Text>
          <Text>API courtesy of OpenWeatherAPI</Text>
        </View>
        </Box>
      </LinearGradient>
    </NativeBaseProvider>
  );
};

// Style for text
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  img: {
    flex: 3,
    width: '100%',
    height: '100%',
  },
  button: {
    flex: 1,
    height: 1278,
    width: 429,
  },
});


