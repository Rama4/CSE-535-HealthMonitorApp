import {useState} from 'react';
import {Button, View, Text, FlatList, StyleSheet} from 'react-native';
import {SymptomList} from '../utils/symptomConstants';
import StarRating from './StarRating';

export default function SymptomLoggingScreen() {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [rating, setRating] = useState(0);

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

  const onSetStarRating = index => {
    setRating(index);
    console.log(`onSetStarRating: ${index}`);
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
        {selectedSymptom !== '' && (
          <StarRating onSetStarRating={onSetStarRating} />
        )}
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
