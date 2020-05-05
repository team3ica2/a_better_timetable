require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
const port = 3000;
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT || 3306,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// returns an array of JSON objects with all of the classes
async function getClasses() {
  const classes = [];
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query('SELECT * FROM classes');

    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (const elem of dbRet) {
      classes.push(elem);
    }
  } catch (err) {
    console.log(err);
  }
  if (conn) {
    conn.end();
    return classes;
  }
  return "Couldn't connect to the database";
}

// Accepts a JSON object and creates a class
// TODO: Insert data on specified position when looping through the array.
async function postClass(classJson) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    for (const val in classJson) {
      keys.push(val);
      vals.push(classJson[val]);
    }
    const res = await conn.query(`INSERT INTO classes (${keys[0]}, ${keys[1]}, ${keys[2]}) VALUES (?, ?, ?)`, vals);
    console.log(res);
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}

//deletes all classes
async function deleteClasses() {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    const res = await conn.query('DELETE FROM classes');
    console.log(res);
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}


// returns an array of JSON objects with all of the classes
async function getUsers() {
  const users = [];
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query('SELECT * FROM users');

    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (const elem of dbRet) {
      users.push(elem);
    }
  } catch (err) {
    console.log(err);
  }
  if (conn) {
    conn.end();
    return users;
  }
  return "Couldn't connect to the database";
}

// Accepts a JSON object and creates a class
// TODO: Insert data on specified position when looping through the array.
async function userPost(userJson) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    for (const val in userJson) {
      keys.push(val);
      vals.push(userJson[val]);
    }
    const res = await conn.query(`INSERT INTO users (${keys[0]}, ${keys[1]}, ${keys[2]}, \
    ${keys[3]}, ${keys[4]}) VALUES (?, ?, ?, ?, ?)`, vals);
    console.log(res);
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}

//deletes all users
async function deleteUsers() {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    const res = await conn.query('DELETE FROM users');
    console.log(res);
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}


// returns an array of JSON objects with all of the classes
async function getStudents() {
  const students = [];
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query('SELECT * FROM students');

    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (const elem of dbRet) {
      students.push(elem);
    }
  } catch (err) {
    console.log(err);
  }
  if (conn) {
    conn.end();
    return students;
  }
  return "Couldn't connect to the database";
}

// Accepts a JSON object and creates a class
// TODO: Insert data on specified position when looping through the array.
async function studentPost(studentJson) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    for (const val in studentJson) {
      keys.push(val);
      vals.push(studentJson[val]);
    }
    const res = await conn.query(`INSERT INTO students (${keys[0]}, ${keys[1]}, ${keys[2]}, \
    ${keys[3]}) VALUES (?, ?, ?, ?)`, vals);
    console.log(res);
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}

async function deleteStudents() {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    const res = await conn.query('DELETE FROM students');
    console.log(res);
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to PC_Timetable API',
  });
});

// returns all classes
app.route('/classes')
  .get((req, res) => {
    getClasses()
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  })
  .post((req, res) => {
    const classJson = (req.body);
    postClass(classJson)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
    deleteClasses()
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  })

// returns all users
app.route('/users')
  .get((req, res) => {
    getUsers()
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  })
  .post((req, res) => {
    const userJson = (req.body);
    userPost(userJson)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
    deleteUsers()
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  })

// returns all students
app.route('/students')
  .get((req, res) => {
    getStudents()
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  })
  .post((req, res) => {
    const studentJson = (req.body);
    studentPost(studentJson)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
    deleteStudents()
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  })

app.listen(port, () => console.log(`API listening on port ${port}!`));
