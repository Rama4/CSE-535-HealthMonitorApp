import {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Button from './Button';
import axios from 'axios';
import {API_KEY} from '@env';

const sample_data = [
  {
    elements: [
      {
        distance: {
          text: '9.8 mi',
          value: 15845,
        },
        duration: {
          text: '19 mins',
          value: 1124,
        },
        duration_in_traffic: {
          text: '19 mins',
          value: 1164,
        },
        status: 'OK',
      },
    ],
  },
];

const sample_data2 = [
  {
    elements: [
      {
        distance: {
          text: '48.0 mi',
          value: 77307,
        },
        duration: {
          text: '58 mins',
          value: 3477,
        },
        duration_in_traffic: {
          text: '1 hour 3 mins',
          value: 3797,
        },
        status: 'OK',
      },
    ],
  },
];

export default function MapsScreen({navigation}) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(0);

  const [distance, setDistance] = useState(0);
  const [timeNormal, setTimeNormal] = useState(0);
  const [timeHeavy, setTimeHeavy] = useState(0);
  const [sourceCoordiante, setSourceCoordiante] = useState(
    '33.40939294282564,-111.92036727216396',
  );
  const [destinationCoordiante, setDestinationCoordiante] = useState(
    '33.43577345128576,-112.00883875389681',
  );

  const getDistanceMatrixUrl = (
    origins,
    destinations,
    departure_time = 'now',
    units = 'imperial',
  ) =>
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&departure_time=${departure_time}&units=${units}&key=${API_KEY}`;

  const getDistanceInMiles = distanceInMetres => distanceInMetres / 1609.344;

  const distanceMiles = distance;
  const timeNormalHrs = timeNormal / 3600;
  const timeHeavyHrs = timeHeavy / 3600;

  useEffect(() => {
    console.log(
      'distance=',
      distance,
      'timeNormal=',
      timeNormal,
      'timeHeavy=',
      timeHeavy,
    );
  }, [distance, timeNormal, timeHeavy]);

  const onSymptomsPressTest = async () => {
    console.log('Symptoms button pressed');
    const source = sourceCoordiante;
    const dest = destinationCoordiante;
    console.log('source=', source);
    console.log('dest=', dest);
    try {
      setIsLoading(1);
      const response = await axios.get('https://www.google.com');
      console.log(JSON.stringify(response.status, null, 4));
      const data_element = sample_data2[0]?.elements[0];
      const distanceInMetres = data_element?.distance?.value;
      const timeNormalSecs = data_element?.duration?.value;
      const timeHeavySecs = data_element?.duration_in_traffic?.value;
      setDistance(distanceInMetres);
      setTimeNormal(timeNormalSecs);
      setTimeHeavy(timeHeavySecs);
      setIsLoading(2);
    } catch (error) {
      console.log(error);
    }
  };

  const onSymptomsPress = async () => {
    console.log('Symptoms button pressed');
    const source = sourceCoordiante;
    const dest = destinationCoordiante;
    console.log('source=', source);
    console.log('dest=', dest);
    try {
      const url = getDistanceMatrixUrl(source, dest);
      setIsLoading(1);
      const response = await axios.get(url);
      const data = response?.data?.rows;
      console.log(JSON.stringify(data, null, 4));
      const data_element = data[0]?.elements[0];
      const distanceInMetres = data_element?.distance?.value;
      const timeNormalSecs = data_element?.duration?.value;
      const timeHeavySecs = data_element?.duration_in_traffic?.value;
      setDistance(distanceInMetres);
      setTimeNormal(timeNormalSecs);
      setTimeHeavy(timeHeavySecs);
      setIsLoading(2);
    } catch (error) {
      console.log(error);
    }
  };

  const onSourceCoordinateChange = text => {
    console.log(text);
    setSourceCoordiante(text);
  };
  const onDestinationCoordinateChange = text => {
    console.log(text);
    setDestinationCoordiante(text);
  };

  const roundDecimal = (val, nDigits = 2) => {
    return val.toFixed(nDigits);
  };

  const renderGetDistanceMatrixButton = () => {
    // return <Button onPress={onSymptomsPressTest} title="Get Distance Matrix" />;
    return (
      <Button
        disabled={isKeyboardOpen}
        onPress={onSymptomsPress}
        title="Get Distance Matrix"
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView>
        <View style={styles.view}>
          <Text style={styles.label}>Source Co-ordinates:</Text>

          <TextInput
            onFocus={() => setIsKeyboardOpen(true)}
            onBlur={() => setIsKeyboardOpen(false)}
            style={styles.input}
            value={sourceCoordiante}
            onChangeText={onSourceCoordinateChange}></TextInput>
          <Text style={styles.label}>Destination Co-ordinates:</Text>
          <TextInput
            onFocus={() => setIsKeyboardOpen(true)}
            onBlur={() => setIsKeyboardOpen(false)}
            style={styles.input}
            value={destinationCoordiante}
            onChangeText={onDestinationCoordinateChange}></TextInput>
          {renderGetDistanceMatrixButton()}
          <View style={styles.resultsContainer}>
            {isLoading === 1 && <Text>Loading..</Text>}
            {isLoading === 2 && (
              <>
                <Text>Distance : {roundDecimal(distanceMiles)} Miles</Text>
                <Text>
                  Time in normal traffic : {roundDecimal(timeNormalHrs)}
                </Text>
                <Text>
                  Time in heavy traffic : {roundDecimal(timeHeavyHrs)}
                </Text>
                <Text>
                  Average velocity in normal traffic :{' '}
                  {roundDecimal(distanceMiles / timeNormalHrs)}
                </Text>
                <Text>
                  Average velocity in heavy traffic :{' '}
                  {roundDecimal(distanceMiles / timeHeavyHrs)}
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  homeButtonsContainer: {
    flex: 1,
    marginTop: 15,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  resultsContainer: {
    paddingTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 20,
  },
});
