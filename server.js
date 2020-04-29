const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'mariadb', 
     user:'root', 
     password: 'hahpie1L',
     database: "timetable",
     port: 3306
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


// returns an array of JSON objects with all of the classes
async function getClasses() {
  let conn;
  try {
	conn = await pool.getConnection();
    const db_ret = await conn.query( 'SELECT * FROM classes');
    var classes = [];
 
    // This is to return classes without meta information
    // TODO: Find a simpler way
    for (let elem of db_ret) {
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
async function postClass(class_json) {
  let conn;
  try {
	conn = await pool.getConnection();
    var vals = []
    for (let val in class_json) {
        vals.push(class_json[val])
    }
    const res = await conn.query("INSERT INTO classes (class_name, class_total_hours, class_difficulty) VALUES (?, ?, ?)", vals);
	console.log(res); 

  } catch (err) {
        console.log(err);
        return 400;
    }

    conn.end();
    return 200;
}

app.get('/', (req, res) =>{
    res.status(200).json({
            message: 'Welcome to PC_Timetable API'
        });
    })


// returns all classes
app.route('/classes')
    .get ((req, res) =>{
        getClasses()
        .then((ret) => {
            if (ret) {
                res.send(ret);           
            } else {
                res.status(400).json ({ 
                    message: 'There was an error processing your request'
                });
            }
            })
     })
    .post((req, res) =>{
        class_json = (req.body)
        postClass(class_json)
        .then((ret) => {
            console.log(ret)
            res.sendStatus(ret)
        })
    })
app.listen(port, () => console.log(`API listening on port ${port}!`))
