const router = require('express').Router();
const controllers = require('../controllers/controllers');



router.get('/docs', (req, res) => {
    res.render('docs');
});

router.get('/docs/classes', (req, res) => {
    res.render('classes');
});

router.get('/docs/users', (req, res) => {
    res.render('users');
});

router.get('/docs/students', (req, res) => {
    res.render('students');
});

router.get('/docs/teachers', (req, res) => {
    res.render('teachers');
});

router.get('/docs/classes_time', (req, res) => {
    res.render('classes_time');
});

router.get('/docs/attendance', (req, res) => {
    res.render('attendance');
});

router.get('/docs/classes_taught', (req, res) => {
    res.render('classes_taught');
});

module.exports = router;
