const router = require('express').Router();
const controllers = require('../controllers/controllers');

router.route('/classes_taken')
// returns all classes_taken
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      controllers.getQuery(req.query, routeName)
        .then((ret) => {
          if (ret) {
            res.send(ret);
          } else {
            res.status(400).json({
              message: 'There was an error processing your request',
            });
          }
        });
    } else {
      controllers.getMany(routeName)
        .then((ret) => {
          if (ret) {
            res.send(ret);
          } else {
            res.status(400).json({
              message: 'There was an error processing your request',
            });
          }
        });
    }
  })
// posts one class_taken row
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const studentJson = (req.body);
    controllers.postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    // deletes one row
    if (Object.keys(req.query).length !== 0) {
      controllers.deleteOne(req.query, routeName)
        .then((ret) => {
          if (ret) {
            res.send(ret);
          } else {
            res.status(400).json({
              message: 'There was an error processing your request',
            });
          }
        });
      // deletes all rows
    } else {
      controllers.deleteMany(routeName)
        .then((ret) => {
          if (ret) {
            res.send(ret);
          } else {
            res.status(400).json({
              message: 'There was an error processing your request',
            });
          }
        });
    }
  })
  .put((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const infoJson = req.body;
    const queries = req.query;
    controllers.updateOne(infoJson, queries, routeName)
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
  .patch((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const infoJson = req.body;
    const queries = req.query;
    controllers.updateOne(infoJson, queries, routeName)
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
module.exports = router;
