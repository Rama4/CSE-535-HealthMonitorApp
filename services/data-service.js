import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {SymptomList, stringWithoutSpaces} from '../utils/symptomConstants';

const DBName = 'healthmonitor.db';
const TableName = 'healthdata';

const CreateTableQuery =
  `create table if not EXISTS ${TableName}  ( 
        heartrate real NOT null, 
        resprate real NOT null,` +
  SymptomList.map(i => `${stringWithoutSpaces(i)} integer NOT null`).join(',') +
  ');';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: DBName, location: 'default'});
};

export const createTable = async db => {
  // create table if not exists

  await db.executeSql(CreateTableQuery);
};

export const printAll = async (db = DBName, table = TableName) => {
  try {
    // const todoItems = [];
    const results = await db.executeSql(`SELECT * FROM ${table}`);
    // results.forEach(result => {
    //   for (let index = 0; index < result.rows.length; index++) {
    //     todoItems.push(result.rows.item(index));
    //   }
    // });
    return results;
  } catch (error) {
    console.error(error);
    // throw Error('Failed to get todoItems !!!');
  }
};

export const getTodoItems = async db => {
  try {
    const todoItems = [];
    const results = await db.executeSql(
      `SELECT rowid as id,value FROM ${tableName}`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    // throw Error('Failed to get todoItems !!!');
  }
};

export const saveTodoItems = async (db, todoItems) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
    todoItems.map(i => `(${i.id}, '${i.value}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async db => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};

// const loadDataCallback = useCallback(async () => {
//   try {
//     const initTodos = [
//       {id: 0, value: 'go to shop'},
//       {id: 1, value: 'eat at least a one healthy foods'},
//       {id: 2, value: 'Do some exercises'},
//     ];
//     const db = await getDBConnection();
//     await createTable(db);
//     const storedTodoItems = await getTodoItems(db);
//     if (storedTodoItems.length) {
//       setTodos(storedTodoItems);
//     } else {
//       await saveTodoItems(db, initTodos);
//       setTodos(initTodos);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }, []);

// useEffect(() => {
//   loadDataCallback();
// }, [loadDataCallback]);

// const addTodo = async () => {
//   if (!newTodo.trim()) return;
//   try {
//     const newTodos = [
//       ...todos,
//       {
//         id:
//           todos.reduce((acc, cur) => {
//             if (cur.id > acc.id) return cur;
//             return acc;
//           }).id + 1,
//         value: newTodo,
//       },
//     ];
//     setTodos(newTodos);
//     const db = await getDBConnection();
//     await saveTodoItems(db, newTodos);
//     setNewTodo('');
//   } catch (error) {
//     console.error(error);
//   }
// };

// const deleteItem = async id => {
//   try {
//     const db = await getDBConnection();
//     await deleteTodoItem(db, id);
//     todos.splice(id, 1);
//     setTodos(todos.slice(0));
//   } catch (error) {
//     console.error(error);
//   }
// };
