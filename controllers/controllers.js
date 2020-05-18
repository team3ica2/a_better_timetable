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

  getStudentsTimetable: async function(studentId) {
    let conn;
    let vals = [];
    vals.push(studentId);
    try {
      conn = await pool.getConnection();
      const dbRet = await conn.query(`select t.class_day, t.start_time, t.end_time, t.room from students s join programme_classes p on s.programme_id=p.programme_id join classes_time t on p.class_id=t.class_id where s.current_semester=p.semester_id and s.student_id=?`, vals);
      conn.end();
      return dbRet;

    } catch (err) {
      console.log(err);
      return "Couldn't connect to the database";
    }
},

  getTeacherTimetable: async function(teacherId) {
    let conn;
    let vals = [];
    vals.push(teacherId);
    try {
      conn = await pool.getConnection();
      const dbRet = await conn.query(`select c.class_name, time.class_day, time.start_time, time.end_time, time.room from classes_taught t join classes_time time on t.class_id=time.class_id join classes c on t.class_id=c.class_id where t.teacher_id=?`, vals);
      conn.end();
      return dbRet;

    } catch (err) {
      console.log(err);
      return "Couldn't connect to the database";
    }
},
}
