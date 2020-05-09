const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT || 3306,
});


module.exports = {
// returns an array of JSON objects
  getMany: async function(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query(`SELECT * FROM ${tableName}`);
    conn.end();
    return dbRet;

  } catch (err) {
    console.log(err);
    return "Couldn't connect to the database";
  }
},

// Accepts a JSON object and creates a row
  postOne: async function(infoJson, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    for (const val in infoJson) {
      keys.push(val);
      vals.push(infoJson[val]);
    }

    // Allowing random number of values -> this code seems pretty stupid
    let valStr = '(';
    for (let i = 0; i < Object.keys(infoJson).length - 1; i++) {
      valStr += '?, ';
    }
    valStr += '?)';
    const res = await conn.query(`INSERT INTO ${tableName} (${keys}) VALUES ${valStr}`, vals);
    console.log(res);
    conn.end();
    return 200;
  } catch (err) {
    console.log(err);
    return 400;
  }

},

// Update a row
  updateOne: async function(infoJson, queries, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    var queryString = '';
    for (const val in infoJson) {
      vals.push(infoJson[val]);
    }
    for (let val in queries) {
      queryString += val + '=' + queries[val] + ' AND ';
    }
    // Allowing random number of values -> this code seems pretty stupid
    let valStr = '';
    for (let value in infoJson) {
      valStr += value + '='
      valStr += '?, ';
    }
    valStr = valStr.substring(0, valStr.length - 2);
    queryString = queryString.substring(0, queryString.length - 5);
    const res = await conn.query(`UPDATE ${tableName} SET ${valStr} WHERE ${queryString}`, vals);
    console.log(res);
    conn.end();
    return 200;
  } catch (err) {
    console.log(err);
    return 400;
  }

},

  getQuery: async function(queries, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    var string = ''
    for (let val in queries) {
      string += val + ' = ' + queries[val] + ' AND ';
    }
    string = string.substring(0, string.length - 5);
    const dbRet = await conn.query(`SELECT * FROM ${tableName} WHERE ${string} `)
    conn.end();
    return dbRet;

  } catch (err) {
    console.log(err);
    return 400;
  }
},

// finds one row based on the id
  findOne: async function(classId, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query(`SELECT * FROM ${tableName} WHERE class_id = ${classId}`);
    conn.end();
    return dbRet;

  } catch (err) {
    console.log(err);
    return 400;
  }
},

// deletes all rows
  deleteMany: async function(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`DELETE FROM ${tableName}`);
    console.log(res);
    conn.end();
    return 200;

  } catch (err) {
    console.log(err);
    return 400;
  }
},
}
