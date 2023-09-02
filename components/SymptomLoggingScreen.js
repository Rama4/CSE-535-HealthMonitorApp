import {useState} from 'react';
import {Button, View, Text, FlatList, StyleSheet} from 'react-native';

const SymptomList = [
  'Nausea',
  'Headache',
  'Diarrhea',
  'Sore Throat',
  'Fever',
  'Muscle Ache',
  'Loss of Smell or Taste',
  'Cough',
  'Shortness of Breath',
  'Feeling tired',
];

export default function SymptomLoggingScreen() {
  const [selectedSymptom, setSelectedSymptom] = useState('');

  const renderSelectedSymptom = () => {
    const selectedItemText =
      'Selected Symptom: ' +
      (selectedSymptom?.length ? selectedSymptom : 'None');
    return <Text style={styles.text}>{selectedItemText}</Text>;
  };

  const onSymptomPress = symptom => {
    console.log('selected:', symptom);
    setSelectedSymptom(symptom);
  };

  const renderSymptomListItem = ({item, index}) => {
    return (
      <Button key={index} title={item} onPress={() => onSymptomPress(item)} />
    );
  };

  const renderSymptomList = () => {
    return (
      <>
        {renderSelectedSymptom()}
        <FlatList
          data={SymptomList}
          renderItem={renderSymptomListItem}
          style={styles.flatlist}
        />
      </>
    );
  };

  return <View style={styles.view}>{renderSymptomList()}</View>;
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
  flatlist: {
    padding: 10,
  },
});
