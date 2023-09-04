import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {SymptomList, stringWithoutSpaces} from '../utils/symptomConstants';

const DBName = 'healthmonitor.db';
export const TableName = 'healthdata';

const CreateTableQuery =
  `create table if not EXISTS ${TableName}  ( 
        heartrate real NOT null, 
        resprate real NOT null,` +
  SymptomList.map(i => `${stringWithoutSpaces(i)} integer NOT null`).join(',') +
  ');';

enablePromise(true);

const errorCB = err => {
  console.log('SQL Error: ' + err);
};

const successCB = err => {
  console.log('SQL executed fine');
};

const openCB = err => {
  console.log('Database OPENED');
};

export const getDBConnection = async () => {
  return openDatabase({name: DBName, location: 'default'}, openCB, errorCB);
};

export const createTable = async db => {
  // create table if not exists

  await db.executeSql(CreateTableQuery);
};

export const printTable = async (db = DBName, tableName = TableName) => {
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

export const insertRow = async (db, tableName = TableName, symptomValues) => {
  const query =
    `INSERT INTO ${tableName} values (72, 20, ` +
    symptomValues.map(s => `${s}`).join(',') +
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

export const deleteTable = async (db, tableName = TableName) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};
