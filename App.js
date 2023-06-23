import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



// Main app
export default function App() {
  return (
    <NavigationContainer> 
      <Stack.Navigator>
        <Stack.Screen name="Welcome to Weatherly" component={HomeScreen} />   
        <Stack.Screen name="Details" component={DetailsScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

// Home
function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
          <Text>Home</Text>
          <Button
          title="Details"
          onPress={()=> navigation.navigate('Details')}
          />
    </View>
  );
}

// details
function DetailsScreen() {
  return (
    <View style={styles.container}>
          <Text>details</Text>
    </View>
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
