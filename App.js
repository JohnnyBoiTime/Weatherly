import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import {ScrollView, Animated, Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigationBuilder, TabRouter} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherScreen from './ShowWeather';

// Main app
export default function App() {
  return (
      <NavigationContainer> 
        <Stack.Navigator screenOptions={{gestureDirection: 'horizontal', gestureResponseDistance: 1284}}>
          <Stack.Screen name="Welcome to Weatherly" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer> 
  );
}

const Stack = createStackNavigator();

const TabBottom = createBottomTabNavigator();

function WelcomeScreen({navigation}) {
  return (
    <View style={styles.container}>
          <Text>Welcome!</Text>
          <Button
          title="Home"
          onPress={()=> navigation.navigate("Home")}
          />
    </View>
  );
}

// Home
function DetailsScreen() {
  return (
    <View style={styles.container}>
          <Text>Details</Text>
    </View>
  );
}

// Credits
function CreditScreen() {
  return (
    <View style={styles.container}>
          <Text>Made by Philip Rickey</Text>
    </View>
  
  );
}

// In progress
function InProgressScreen() {
  return (
    <View style={styles.container}>
          <Text>In Progress</Text>
    </View>
  );
}

// details
function HomeScreen(){
  return (
    <TabBottom.Navigator screenOptions={{headerShown: false, gestureDirection: 'horizontal', gestureResponseDistance: 1284}}>
      <TabBottom.Screen name="Details" component={DetailsScreen}/>
      <TabBottom.Screen name="Current Weather" component={WeatherScreen}/>
      <TabBottom.Screen name="In Progress" component={InProgressScreen} />
      <TabBottom.Screen name="Credits" component={CreditScreen} />
    </TabBottom.Navigator>
  );
}

// Style for text
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


