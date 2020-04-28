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

getClasses();
var classes = [];
async function getClasses() {
  let conn;
  try {
	conn = await pool.getConnection();
    const ret = await conn.query( 'SELECT * FROM classes');
    classes = [];
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

app.get('/', (req, res) =>{
    res.send('API for MariaDB');
});

// returns all classes
app.route('/classes')
    .get ((req, res) =>{
        getClasses();
        res.send(classes);
});

app.listen(port, () => console.log('API listening on port ${port}!'))
