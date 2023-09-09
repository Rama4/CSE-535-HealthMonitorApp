import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {HealthDataTableColumns} from '../utils/symptomConstants';
const tableDataSample = {
  tableHead: HealthDataTableColumns,
  // tableHead: [
  //   'Crypto Name',
  //   'Crypto Symbol',
  //   'Current Value',
  //   'Movement',
  //   'Mkt Cap',
  //   'Description',
  // ],
  // widthArr: [140, 160, 180, 120, 220, 540],
  _tableData: [
    [
      'Bitcoin',
      'BTC',
      '$44,331',
      '$2.70',
      '$839,702,328,904',
      'Bitcoin (₿) is a decentralized digital currency, without a central bank or single administrator',
    ],
    [
      'Ethereum',
      'ETH',
      '$3000.9',
      '$3.49',
      '$359,080,563,225',
      'Ethereum is a decentralized, open-source blockchain with smart contract functionality. ',
    ],
    [
      'Tether',
      'USDT',
      '$1',
      '$0.03',
      '$79,470,820,738',
      'Tether (often called by its symbol USDT) is a cryptocurrency that is hosted on the Ethereum and Bitcoin blockchains, among others.',
    ],
    [
      'BNB',
      'BNB',
      '$413.44',
      '$4.68',
      '$69,446,144,361',
      'Binance is a cryptocurrency exchange which is the largest exchange in the world in terms of daily trading volume of cryptocurrencies',
    ],
    [
      'USD Coin',
      'USDC',
      '$1',
      '$0.01',
      '$53,633,260,549',
      'USD Coin (USDC) is a digital stablecoin that is pegged to the United States dollar. USD Coin is managed by a consortium called Centre',
    ],
    [
      'Tether',
      'USDT',
      '$1',
      '$0.03',
      '$79,470,820,738',
      'Tether (often called by its symbol USDT) is a cryptocurrency that is hosted on the Ethereum and Bitcoin blockchains, among others.',
    ],
    [
      'BNB',
      'BNB',
      '$413.44',
      '$4.68',
      '$69,446,144,361',
      'Binance is a cryptocurrency exchange which is the largest exchange in the world in terms of daily trading volume of cryptocurrencies',
    ],
    [
      'USD Coin',
      'USDC',
      '$1',
      '$0.01',
      '$53,633,260,549',
      'USD Coin (USDC) is a digital stablecoin that is pegged to the United States dollar. USD Coin is managed by a consortium called Centre',
    ],
    [
      'Tether',
      'USDT',
      '$1',
      '$0.03',
      '$79,470,820,738',
      'Tether (often called by its symbol USDT) is a cryptocurrency that is hosted on the Ethereum and Bitcoin blockchains, among others.',
    ],
    [
      'BNB',
      'BNB',
      '$413.44',
      '$4.68',
      '$69,446,144,361',
      'Binance is a cryptocurrency exchange which is the largest exchange in the world in terms of daily trading volume of cryptocurrencies',
    ],
    [
      'USD Coin',
      'USDC',
      '$1',
      '$0.01',
      '$53,633,260,549',
      'USD Coin (USDC) is a digital stablecoin that is pegged to the United States dollar. USD Coin is managed by a consortium called Centre',
    ],
    [
      'Tether',
      'USDT',
      '$1',
      '$0.03',
      '$79,470,820,738',
      'Tether (often called by its symbol USDT) is a cryptocurrency that is hosted on the Ethereum and Bitcoin blockchains, among others.',
    ],
    [
      'BNB',
      'BNB',
      '$413.44',
      '$4.68',
      '$69,446,144,361',
      'Binance is a cryptocurrency exchange which is the largest exchange in the world in terms of daily trading volume of cryptocurrencies',
    ],
    [
      'USD Coin',
      'USDC',
      '$1',
      '$0.01',
      '$53,633,260,549',
      'USD Coin (USDC) is a digital stablecoin that is pegged to the United States dollar. USD Coin is managed by a consortium called Centre',
    ],
  ],
};
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
          <Table borderStyle={{borderWidth: 1, borderColor: 'purple'}}>
            <Row
              data={HealthDataTableColumns}
              widthArr={widthArr}
              style={styles.head}
              textStyle={styles.headText}
            />
          </Table>
          <ScrollView>
            <Table borderStyle={{borderWidth: 1, borderColor: 'purple'}}>
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
  head: {backgroundColor: 'darkblue'},
  headText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  text: {margin: 6, fontSize: 16, fontWeight: 'bold', textAlign: 'center'},
});
export default TableComponent;
