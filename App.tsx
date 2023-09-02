import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import SymptomLoggingScreen from './components/SymptomLoggingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="SymptomLogging"
          component={SymptomLoggingScreen}
          options={{
            title: 'Symptom Logging Page',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
