const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost', 
     user:'root', 
     password: 'team3',
     database: "PC_Timetable",
     port: 3306
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Calling it once because on first request the server return an empty array
// TODO: find another solution
getClasses();
var classes = [];

// returns an array of JSON objects with all of the classes
// TODO: Return sensible errors
async function getClasses() {
  let conn;
  try {
	conn = await pool.getConnection();
    const ret = await conn.query( 'SELECT * FROM classes');
    classes = [];
 
    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (let elem of ret) {
        classes.push(elem);
    }
    // Syntax for updating and inserting
    // const res = await conn.query("UPDATE classes SET class_name = (?) WHERE class_id = 2", ["ALDS"]);
    // const res = await conn.query("INSERT INTO classes (class_name) VALUES (?)", ["Math"]);
	// console.log(res); // { affectedrows: 1, insertid: 1, warningstatus: 0 }
  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
 }  
}

// Accepts a JSON object and creates a class
// TODO: Check input and return errors
async function postClass(class_json) {
  let conn;
  try {
	conn = await pool.getConnection();
    var vals = []
    for (let val in class_json) {
        vals.push(class_json[val])
    }
    // Syntax for updating and inserting
    const res = await conn.query("INSERT INTO classes (class_name, class_total_hours, class_difficulty) VALUES (?, ?, ?)", vals);
	console.log(res); // { affectedrows: 1, insertid: 1, warningstatus: 0 }
  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
 }  
}

app.get('/', (req, res) =>{
    res.send('API for MariaDB');
});

// returns all classes
app.route('/classes')
    .get ((req, res) =>{
        getClasses();
        res.send(classes);
     })
// TODO: add statuses for errors
    .post((req, res) =>{
        class_json = (req.body)
        postClass(class_json)
        res.sendStatus(200)
    })
app.listen(port, () => console.log('API listening on port ${port}!'))
