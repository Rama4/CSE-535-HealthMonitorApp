import {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {SymptomList} from '../utils/symptomConstants';
import StarRating from './StarRating';
import Button from './Button';
import useDataService, {TableName} from '../services/useDataService';

import {useSelector, useDispatch} from 'react-redux';
import {
  selectHeartRate,
  selectRespRate,
  selectSymptoms,
  setSymptomVal,
} from './redux/slices/appSlice';

export default function SymptomLoggingScreen() {
  const dispatch = useDispatch();
  const [symptomValues, setSymptomValues] = useState(
    new Array(SymptomList.length).fill(0),
  );
  const symptomsVal = useSelector(selectSymptoms);
  const _heartRate = useSelector(selectHeartRate);
  const _respRate = useSelector(selectRespRate);
  const isUploadBtnDisabled = !_heartRate || !_respRate;

  const {getDBConnection, createTable, insertRow, printTable} =
    useDataService();
  const [selectedSymptom, setSelectedSymptom] = useState(-1);
  const starRating = selectedSymptom >= 0 ? symptomsVal[selectedSymptom] : 0;

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
  useEffect(() => {
    console.log('symptomsVal = ', symptomsVal);
  }, [symptomsVal]);

  const showToast = (success = false) => {
    ToastAndroid.show(
      success
        ? 'Successfully inserted the values into the table!'
        : 'Failed to insert the values into the table!',
      ToastAndroid.SHORT,
    );
  };

  const onUploadSymptomsPress = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      // console.log(symptomValues);
      const insertRowResult = await insertRow(db, TableName);
      console.log('added values into table..');
      if (insertRowResult) {
        showToast(true);
      } else {
        showToast();
      }
      await printTable(db, TableName);
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

  const renderSymptomListItem = useCallback(
    ({item, index}) => {
      return (
        <Pressable
          style={
            index !== selectedSymptom
              ? styles.symptomListButton
              : styles.symptomListButtonSelected
          }
          key={index}
          onPress={() => onSymptomPress(index)}>
          <Text style={styles.text}>{item}</Text>
        </Pressable>
      );
    },
    [selectedSymptom],
  );

  const onSetStarRating = val => {
    // setRating(val);
    console.log(`onSetStarRating: ${val}`);
    dispatch(setSymptomVal({index: selectedSymptom, value: val}));

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
      <Button
        title="Upload Symptoms"
        onPress={onUploadSymptomsPress}
        disabled={isUploadBtnDisabled}
      />
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
    color: 'black',
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
    backgroundColor: '#eee',
    height: 50,
  },
  symptomListButtonSelected: {
    backgroundColor: '#777',
    color: 'white',
    height: 50,
  },
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },
});
