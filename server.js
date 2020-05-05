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


// returns an array of JSON objects
async function getMany(tableName) {
  const info = [];
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query(`SELECT * FROM ${tableName}`);

    // This is to return without meta information
    // TODO: Find a simpler way
    for (const elem of dbRet) {
      info.push(elem);
    }
  } catch (err) {
    console.log(err);
  }
  if (conn) {
    conn.end();
    return info;
  }
  return "Couldn't connect to the database";
}

// Accepts a JSON object and creates a row
// TODO: Insert data on specified position when looping through the array.
async function postOne(infoJson, tableName) {
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
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}


// finds one row based on the id
async function findOne(classId, tableName) {
  const classInfo = [];
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query(`SELECT * FROM ${tableName} WHERE class_id = ${classId}`);

    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (const elem of dbRet) {
      classInfo.push(elem);
    }
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return classInfo;
}

// deletes all rows
async function deleteMany(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`DELETE FROM ${tableName}`);
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

app.route('/classes')
  // returns all classes
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    getMany(routeName)
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

  // posts one class
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const classJson = (req.body);
    postOne(classJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  // deletes all classes
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  });


app.route('/classes/:classId')
  // returns one class based on id
  // TODO return all applicable classes based on the provided parameter
  .get((req, res) => {
    const routeName = req.route.path.split('/')[1];
    findOne(req.params.classId, routeName)
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  });


app.route('/users')
  // returns all users
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    getMany(routeName)
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
  // posts one user
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const userJson = (req.body);
    postOne(userJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  // deletes all users
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  });

app.route('/students')
  // returns all students
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    getMany(routeName)
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
  // posts one student
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const studentJson = (req.body);
    postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  // deletes all students
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  });

app.listen(port, () => console.log(`API listening on port ${port}!`));
