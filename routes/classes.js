const router = require('express').Router();
const controllers = require('../controllers/controllers');
router.route('/classes')
// returns classes based on requests parameters
// or all classes if there are no parameters
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

// posts one class
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const infoJson = req.body;
    controllers.postOne(infoJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all classes
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
