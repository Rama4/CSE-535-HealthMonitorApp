import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {SymptomList, stringWithoutSpaces} from '../utils/symptomConstants';
import {
  selectHeartRate,
  selectRespRate,
  selectSymptoms,
} from '../components/redux/slices/appSlice';
import {useSelector} from 'react-redux';

const DBName = 'healthmonitor.db';
export const TableName = 'healthdata';

const CreateTableQuery =
  `create table if not EXISTS ${TableName}  ( 
        heartrate real NOT null, 
        resprate real NOT null,` +
  SymptomList.map(i => `${stringWithoutSpaces(i)} integer NOT null`).join(',') +
  ');';

enablePromise(true);

export default function useDataService() {
  const symptomsVal = useSelector(selectSymptoms);
  const heartRate = useSelector(selectHeartRate);
  const respRate = useSelector(selectRespRate);

  const errorCB = err => {
    console.log('SQL Error: ' + err);
  };

  const successCB = err => {
    console.log('SQL executed fine');
  };

  const openCB = err => {
    console.log('Database OPENED');
  };

  const getDBConnection = async () => {
    return openDatabase({name: DBName, location: 'default'}, openCB, errorCB);
  };

  const createTable = async db => {
    // create table if not exists

    await db.executeSql(CreateTableQuery);
  };

  const printTable = async (db = DBName, tableName = TableName) => {
    try {
      const todoItems = [];
      const results = await db.executeSql(`SELECT * FROM ${tableName}`);
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          todoItems.push(result.rows.item(index));
        }
      });
      console.log('printing table:', tableName);
      console.log(JSON.stringify(todoItems, null, 4));
      return results;
    } catch (error) {
      console.error(error);
      // throw Error('Failed to get todoItems !!!');
    }
  };

  const insertRow = async (db, tableName = TableName) => {
    const query =
      `INSERT INTO ${tableName} values (${heartRate}, ${respRate}, ` +
      symptomsVal.map(s => `${s}`).join(',') +
      ');';
    console.log('query=', query);
    try {
      const todoItems = [];
      const results = await db.executeSql(query);
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          todoItems.push(result.rows.item(index));
        }
      });
      console.log(JSON.stringify(todoItems, null, 4));
      return results;
    } catch (error) {
      console.error(error);
      // throw Error('Failed to get todoItems !!!');
    }
  };

  const deleteTable = async (db, tableName = TableName) => {
    const query = `drop table ${tableName}`;

    await db.executeSql(query);
  };

  return {
    getDBConnection,
    createTable,
    printTable,
    insertRow,
    deleteTable,
  };
}
