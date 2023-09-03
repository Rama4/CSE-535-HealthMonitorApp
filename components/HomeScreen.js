import React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import CameraView from './CameraView';

export default function HomeScreen({navigation}) {
  const onUploadSignsPress = () => {
    console.log('upload signs button pressed');
  };
  const onSymptomsPress = () => {
    console.log('Symptoms button pressed');
    navigation.navigate('SymptomLogging');
  };
  const onMeasureHeartRatePress = () => {
    console.log('Measure Heart Rate button pressed');
    // navigation.navigate('SymptomLogging');
  };
  const onMeasureRespiratoryRatePress = () => {
    console.log('Measure Respiratory Rate button pressed');
    // navigation.navigate('SymptomLogging');
  };

  return (
    <View style={styles.view}>
      <CameraView />
      <Button title="Symptoms" onPress={onSymptomsPress} />
      <Button title="Upload Signs" onPress={onUploadSignsPress} />
      <Button title="Measure Heart Rate" onPress={onMeasureHeartRatePress} />
      <Button
        title="Measure Respiratory Rate"
        onPress={onMeasureRespiratoryRatePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 30,
    color: '#000',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
