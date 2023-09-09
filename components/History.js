import {Text} from 'react-native';
import {useEffect, useState} from 'react';
import useDataService, {TableName} from '../services/useDataService';
import TableComponent from './TableComponent';

export default function History() {
  const {getDBConnection, insertRow, printTable} = useDataService();
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    async function loadTableFromDB() {
      try {
        const db = await getDBConnection();
        // console.log(symptomValues);
        const printResults = await printTable(db);
        console.log('printResults=', printResults);
        if (printResults) {
          setTableData(printResults);
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadTableFromDB();

    return () => {};
  }, []);

  // History
  return (
    <>
      {tableData?.length > 0 ? (
        <TableComponent tableData={tableData} />
      ) : (
        <Text style={{fontSize: 20, margin: 20}}>History is empty!</Text>
      )}
    </>
  );
}
