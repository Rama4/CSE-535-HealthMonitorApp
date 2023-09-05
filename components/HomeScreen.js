import {useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import CameraView from './CameraView';
import {
  getDBConnection,
  createTable,
  insertRow,
  printTable,
  deleteTable,
} from '../services/data-service';
import Button from './Button';

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

  const onRespRateSensorPress = () => {
    console.log(' onRespRateSensorPress');
    navigation.navigate('RespiratorySensor');
  };

  return (
    <ScrollView>
      <View style={styles.view}>
        <CameraView />
        <View style={styles.rowContainer}>
          <Button title="Symptoms" onPress={onSymptomsPress} />
          <Button title="Upload Signs" onPress={onUploadSignsPress} />
        </View>
        <View style={styles.rowContainer}>
          <Button
            title="Measure Heart Rate"
            onPress={onMeasureHeartRatePress}
          />
        </View>
        <View style={styles.rowContainer}>
          <Button
            title="Measure Respiratory Rate"
            onPress={onMeasureRespiratoryRatePress}
          />
        </View>
        <View style={styles.rowContainer}>
          <Button title="create DB" onPress={onCreateDBPress} />
          <Button title="insert row" onPress={onInsertRowPress} />
        </View>
        <View style={styles.rowContainer}>
          <Button title="print table" onPress={onPrintTablePress} />
          <Button title="delete table" onPress={onDeleteTablePress} />
        </View>
        <Button title="RespRate Sensor" onPress={onRespRateSensorPress} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
});
