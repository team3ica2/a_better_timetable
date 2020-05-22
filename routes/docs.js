const router = require('express').Router();
const controllers = require('../controllers/controllers');

// Home page for the docs
router.get('/docs', (req, res) => {
  res.render('docs');
});

// Classes endpoint docs
router.get('/docs/classes', (req, res) => {
  res.render('classes');
});

// Users endpoint docs
router.get('/docs/users', (req, res) => {
  res.render('users');
});

// Students endpoint docs
router.get('/docs/students', (req, res) => {
  res.render('students');
});

// Teachers endpoint docs
router.get('/docs/teachers', (req, res) => {
  res.render('teachers');
});

// Classes_time endpoint docs
router.get('/docs/classes_time', (req, res) => {
  res.render('classes_time');
});

// Attendance endpoint docs
router.get('/docs/attendance', (req, res) => {
  res.render('attendance');
});

// Classes_taught endpoint docs
router.get('/docs/classes_taught', (req, res) => {
  res.render('classes_taught');
});

module.exports = router;
