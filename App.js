import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import {ImageBackground, Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigationBuilder, TabRouter} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherScreen from './ShowWeather';

// Main app
export default function App() {
  return (
      <NavigationContainer> 
        <TabBottom.Navigator screenOptions={{headerShown: false, gestureDirection: 'horizontal', gestureResponseDistance: 1284}}>
        <TabBottom.Screen name="Current Weather" component={WeatherScreen}/>
        <TabBottom.Screen name="Details" component={InProgressScreen2}/>
        <TabBottom.Screen name="In Progress" component={InProgressScreen} />
        <TabBottom.Screen name="Credits" component={CreditScreen} />
      </TabBottom.Navigator>
      </NavigationContainer> 
  );
};

const Stack = createStackNavigator();

const TabBottom = createBottomTabNavigator();

// Home
function InProgressScreen2() {
  return (
    <View style={styles.container}>
          <Text>In Progress</Text>
    </View>
  );
};

// Credits
function CreditScreen() {
  return (
    <View style={styles.container}>
          <Text>Made by Philip Rickey</Text>
    </View>
  
  );
};

function InProgressScreen() {
  return (
    <View style={styles.container}>
          <Text>In Progress</Text>
    </View>
  
  );
};

// Style for text
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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


