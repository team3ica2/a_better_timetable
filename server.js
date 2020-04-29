const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
const port = 3000;
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'team3',
  database: 'PC_Timetable',
  port: 3306,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// returns an array of JSON objects with all of the classes
async function getClasses() {
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query('SELECT * FROM classes');
    var classes = [];

    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (const elem of dbRet) {
      classes.push(elem);
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
      return classes;
    }
  }
}

// Accepts a JSON object and creates a class
async function postClass(classJson) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    for (const val in classJson) {
      vals.push(classJson[val]);
    }
    const res = await conn.query('INSERT INTO classes (class_name, class_total_hours, class_difficulty) VALUES (?, ?, ?)', vals);
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
  });

app.listen(port, () => console.log(`API listening on port ${port}!`));
