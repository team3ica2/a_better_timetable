const router = require('express').Router();
const controllers = require('../controllers/controllers');

router.route('/classes_taught')
// returns all classes_taught
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
// posts one classes_taught row
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const studentJson = (req.body);
    controllers.postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all classes_taught
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
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
