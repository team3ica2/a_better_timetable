const router = require('express').Router();
const controllers = require('../controllers/controllers');

router.route('/attendance')
  .get((req, res) => {
    // Use the route name to get the appropriate table name,
    // which has the same name
    const routeName = req.route.path.replace('/', '');
    // Check for a query, if there is one, call getQuery
    // with the query parameters
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
      // if there isn't a query, return all rows from the db
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
// posts one row
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const infoJson = (req.body);
    controllers.postOne(infoJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    // deletes one row if there is a query
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
// TODO: PUT has the same functionality as PATCH as of now
// Updates some fields in the db based on a query
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
// Updates some fields in the db based on a query
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
