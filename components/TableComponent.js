import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {HealthDataTableColumns} from '../utils/symptomConstants';

const TableComponent = ({tableData}) => {
  useEffect(() => {
    console.log('tableData=', tableData);

    return () => {};
  }, [tableData]);

  const getRowData = rowData => {
    return [
      rowData['heartrate'],
      rowData['resprate'],
      rowData['Nausea'],
      rowData['Headache'],
      rowData['Diarrhea'],
      rowData['SoreThroat'],
      rowData['Fever'],
      rowData['MuscleAche'],
      rowData['LossofSmellorTaste'],
      rowData['Cough'],
      rowData['ShortnessofBreath'],
      rowData['Feelingtired'],
    ];
  };

  const widthArr = [100, 200, 100, 100, 100, 100, 100, 100, 200, 100, 200, 100];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        persistentScrollbar={true}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: 'black'}}>
            <Row
              data={HealthDataTableColumns}
              widthArr={widthArr}
              style={styles.head}
              textStyle={styles.headText}
            />
          </Table>
          <ScrollView>
            <Table borderStyle={{borderWidth: 1, borderColor: 'black'}}>
              {tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={getRowData(rowData)}
                  widthArr={widthArr}
                  style={styles.rowSection}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  rowSection: {height: 60, backgroundColor: '#E7E6E1'},
  head: {backgroundColor: '#555'},
  headText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  text: {
    margin: 6,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
});
export default TableComponent;
