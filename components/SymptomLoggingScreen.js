import {useCallback, useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import {SymptomList} from '../utils/symptomConstants';
import StarRating from './StarRating';
import {
  getDBConnection,
  createTable,
  insertRow,
  printTable,
  deleteTable,
  TableName,
} from '../services/data-service';
import Button from './Button';

export default function SymptomLoggingScreen() {
  const [symptomValues, setSymptomValues] = useState(
    new Array(SymptomList.length).fill(0),
  );
  const [selectedSymptom, setSelectedSymptom] = useState(-1);
  const starRating = selectedSymptom >= 0 ? symptomValues[selectedSymptom] : 0;

  useEffect(() => {
    console.log(
      'selectedSymptom = ',
      selectedSymptom ? SymptomList[selectedSymptom] : 'none',
    );
    console.log('starRating=', starRating);
  }, [selectedSymptom]);
  useEffect(() => {
    console.log('symptomValues = ', symptomValues);
    console.log('starRating=', starRating);
  }, [symptomValues]);

  const onUploadSymptomsPress = useCallback(async () => {
    try {
      const db = await getDBConnection();
      console.log(symptomValues);
      await insertRow(db, TableName, symptomValues);
      console.log('added values into table..');
    } catch (error) {
      console.error(error);
    }
  }, [symptomValues]);

  const separator = () => {
    //add a seperator component for each item with green color:
    return <View style={styles.separator} />;
  };

  const onSymptomPress = index => {
    console.log('selected:', SymptomList[index]);
    setSelectedSymptom(index);
    // setRating(symptomValues[index]);
  };

  const renderSymptomListItem = ({item, index}) => {
    return (
      <Pressable
        style={styles.symptomListButton}
        key={index}
        onPress={() => onSymptomPress(index)}>
        <Text style={styles.text}>{item}</Text>
      </Pressable>
    );
  };

  const onSetStarRating = val => {
    // setRating(val);
    console.log(`onSetStarRating: ${val}`);
    setSymptomValues(_symptomValues => {
      let symptoms = [..._symptomValues];
      symptoms[selectedSymptom] = val;
      return symptoms;
    });
  };

  const renderStarRating = () => {
    if (selectedSymptom >= 0) {
      return (
        <>
          <Text style={styles.text}>
            Set rating for the symptom: {SymptomList[selectedSymptom]}
          </Text>
          {/* <StarRating onSetStarRating={onSetStarRating} /> */}
          <StarRating rating={starRating} onSetStarRating={onSetStarRating} />
        </>
      );
    }
  };

  const renderSymptomList = () => {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={SymptomList}
          renderItem={renderSymptomListItem}
          style={styles.flatlist}
          ItemSeparatorComponent={separator}
          persistentScrollbar={true}
        />
        {renderStarRating()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Select symptom from the list and select a rating for it:
      </Text>
      {renderSymptomList()}
      <Button title="Upload Symptoms" onPress={onUploadSymptomsPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
  },
  text: {
    fontSize: 24,
    // color: 'white',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
  },
  flatlist: {
    paddingHorizontal: 10,
    // backgroundColor: 'orange',
    minHeight: 300,
    maxHeight: '40%',
  },
  symptomListButton: {
    backgroundColor: 'lightgray',
  },
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },
});
