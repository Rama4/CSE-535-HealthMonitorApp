import {useCallback} from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import CameraView from './CameraView';
import {
  getDBConnection,
  createTable,
  insertRow,
  printTable,
  deleteTable,
} from '../services/data-service';

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

  const onCreateDBPress = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      console.log('created table..');
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onInsertRowPress = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await insertRow(db);
      console.log('added values into table..');
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onPrintTablePress = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await printTable(db);
      console.log('printed table..');
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onDeleteTablePress = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await deleteTable(db);
      console.log('deleted table..');
    } catch (error) {
      console.error(error);
    }
  }, []);

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
      <Button title="create DB" onPress={onCreateDBPress} />
      <Button title="insert row" onPress={onInsertRowPress} />
      <Button title="print table" onPress={onPrintTablePress} />
      <Button title="delete table" onPress={onDeleteTablePress} />
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
