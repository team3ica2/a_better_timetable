require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const usersRoute = require('./routes/users');
const classesRoute = require('./routes/classes');
const studentsRoute = require('./routes/students');
const teachersRoute = require('./routes/teachers');
const attendanceRoute = require('./routes/attendance');
const classes_taughtRoute = require('./routes/classes_taught');
const classes_timeRoute = require('./routes/classes_time');
const docsRoute = require('./routes/docs');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(usersRoute);
app.use(studentsRoute);
app.use(classesRoute);
app.use(teachersRoute);
app.use(attendanceRoute);
app.use(classes_taughtRoute);
app.use(classes_timeRoute);
app.use(docsRoute);
app.use(express.static('public'))
app.set('view engine', 'ejs');


//TODO patch and put act the same way for now
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// app.get('/docs', (req, res) => {
//     res.render('docs');
// });

// app.get('/docs/classes', (req, res) => {
//     res.render('classes');
// });

// app.get('/docs/users', (req, res) => {
//     res.render('users');
// });

// app.get('/docs/students', (req, res) => {
//     res.render('students');
// });

// app.get('/docs/teachers', (req, res) => {
//     res.render('teachers');
// });

// app.get('/docs/classes_time', (req, res) => {
//     res.render('classes_time');
// });

// app.get('/docs/attendance', (req, res) => {
//     res.render('attendance');
// });

// app.get('/docs/classes_taught', (req, res) => {
//     res.render('classes_taught');
// });

app.listen(port, () => console.log(`API listening on port ${port}!`));
