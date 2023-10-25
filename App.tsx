import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import SymptomLoggingScreen from './components/SymptomLoggingScreen';
import RespiratorySensor from './components/RespiratorySensor';
import {Provider} from 'react-redux';
import {store} from './components/redux/store';
import History from './components/History';
import MapsScreen from './components/MapsScreen';

const Stack = createNativeStackNavigator();

// if (process.env.NODE_ENV === 'production') {
//   console.log = function no_console() {};
//   console.error = function no_console_err() {};
// }

export default function App() {
  return (
    <Provider store={store}>
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
          <Stack.Screen
            name="RespiratorySensor"
            component={RespiratorySensor}
            options={{
              title: 'Respiratory Rate Sensor',
            }}
          />
          <Stack.Screen
            name="History"
            component={History}
            options={{
              title: 'Symptom data history',
            }}
          />
          <Stack.Screen
            name="Maps"
            component={MapsScreen}
            options={{
              title: 'Trip time calculator',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
