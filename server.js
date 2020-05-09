require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const usersRoute = require('./routes/users');
const classesRoute = require('./routes/classes');
const studentsRoute = require('./routes/students');
const teachersRoute = require('./routes/teachers');
const classes_takenRoute = require('./routes/classes_taken');
const classes_taughtRoute = require('./routes/classes_taught');
const classes_timeRoute = require('./routes/classes_time');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(usersRoute);
app.use(studentsRoute);
app.use(classesRoute);
app.use(teachersRoute);
app.use(classes_takenRoute);
app.use(classes_taughtRoute);
app.use(classes_timeRoute);


//TODO patch and put act the same way for now
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to PC_Timetable API',
  });
});

app.listen(port, () => console.log(`API listening on port ${port}!`));
