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
async function getMany(tableName) {
  const info = [];
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query(`SELECT * FROM ${tableName}`);

    // This is to return classes without meta information
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

// Accepts a JSON object and creates a class
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
    const res = await conn.query(`INSERT INTO ${tableName} (${keys[0]}, ${keys[1]}, ${keys[2]}) VALUES (?, ?, ?)`, vals);
    console.log(res);
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return 200;
}

async function findOne(classId, tableName) {
  let class_info = [];
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    const dbRet = await conn.query(`SELECT * FROM ${tableName} WHERE class_id = ${classId}`);

    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (const elem of dbRet) {
      class_info.push(elem);
    }
  } catch (err) {
    console.log(err);
    return 400;
  }

  conn.end();
  return class_info;
}

//deletes all classes
async function deleteMany(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
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

// returns all classes
app.route('/classes')
  .get((req, res) => {
    routeName= req.route['path'].replace('/', '')
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
  .post((req, res) => {
    routeName= req.route['path'].replace('/', '')
    const classJson = (req.body);
    postOne(classJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
    routeName= req.route['path'].replace('/', '')
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
  })
app.route('/classes/:classId')
  .get((req, res) => {
    routeName= req.route['path'].split('/')[1]
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
  })


// returns all users
app.route('/users')
  .get((req, res) => {
   routeName= req.route['path'].replace('/', '')
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
  .post((req, res) => {
   routeName= req.route['path'].replace('/', '')
    const userJson = (req.body);
    postOne(userJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
   routeName= req.route['path'].replace('/', '')
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
  })

// returns all students
app.route('/students')
  .get((req, res) => {
   routeName= req.route['path'].replace('/', '')
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
  .post((req, res) => {
   routeName= req.route['path'].replace('/', '')
    const studentJson = (req.body);
    postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
   routeName= req.route['path'].replace('/', '')
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
  })

app.listen(port, () => console.log(`API listening on port ${port}!`));
