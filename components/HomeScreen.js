import {useCallback} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import CameraView from './CameraView';
import {
  getDBConnection,
  createTable,
  insertRow,
  printTable,
  deleteTable,
} from '../services/useDataService';
import Button from './Button';

export default function HomeScreen({navigation}) {
  const onSymptomsPress = () => {
    console.log('Symptoms button pressed');
    navigation.navigate('SymptomLogging');
  };

  const onMapsPress = () => {
    console.log('onMapsPress');
    navigation.navigate('Maps');
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

  const onHistoryPress = () => {
    navigation.navigate('History');
  };

  const renderHistoryButton = () => {
    return (
      <>
        <View style={styles.rowContainer}>
          <Button title="See symptom data history" onPress={onHistoryPress} />
        </View>
      </>
    );

    {
      /* <View style={styles.rowContainer}>
          <Button title="create DB" onPress={onCreateDBPress} />
          <Button title="insert row" onPress={onInsertRowPress} />
        </View>
        <View style={styles.rowContainer}>
          <Button title="print table" onPress={onPrintTablePress} />
          <Button title="delete table" onPress={onDeleteTablePress} />
        </View> */
    }
  };

  return (
    <ScrollView>
      <View style={styles.view}>
        <Text style={styles.text}>
          Please Measure the heart rate, Respiratory Rate and then log the
          Symptoms.
        </Text>
        <CameraView />
        <View style={styles.homeButtonsContainer}>
          <View style={styles.rowContainer}>
            <Button
              title="Measure Respiratory Rate"
              onPress={onRespRateSensorPress}
            />
          </View>
          <View style={styles.rowContainer}>
            <Button title="Log symptoms" onPress={onSymptomsPress} />
            {/* <Button title="Upload Signs" onPress={onUploadSignsPress} /> */}
          </View>
          {renderHistoryButton()}
          <View style={styles.rowContainer}>
            <Button title="Go to maps screen" onPress={onMapsPress} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // backgroundColor: 'yellow',
    // height: '100%',
    // minHeight: '100%',
  },
  homeButtonsContainer: {
    flex: 1,
    // backgroundColor: 'red',
    marginTop: 15,
  },
  container: {
    flex: 1,
    padding: 24,
    // backgroundColor: '#fff',
  },
  rowContainer: {
    // flex: 1,
    // width
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 20,
    // color: 'white',
  },
});
