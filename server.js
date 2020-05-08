require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
const port = 3000;
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT || 3306,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// returns an array of JSON objects
async function getMany(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query(`SELECT * FROM ${tableName}`);
    conn.end();
    return dbRet;

  } catch (err) {
    console.log(err);
    return "Couldn't connect to the database";
  }
}

// Accepts a JSON object and creates a row
async function postOne(infoJson, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    const keys = [];
    for (const val in infoJson) {
      keys.push(val);
      vals.push(infoJson[val]);
    }

    // Allowing random number of values -> this code seems pretty stupid
    let valStr = '(';
    for (let i = 0; i < Object.keys(infoJson).length - 1; i++) {
      valStr += '?, ';
    }
    valStr += '?)';
    const res = await conn.query(`INSERT INTO ${tableName} (${keys}) VALUES ${valStr}`, vals);
    console.log(res);
    conn.end();
    return 200;
  } catch (err) {
    console.log(err);
    return 400;
  }

}

// Update a row
async function updateOne(infoJson, queries, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const vals = [];
    var queryString = '';
    for (const val in infoJson) {
      vals.push(infoJson[val]);
    }
    for (let val in queries) {
      queryString += val + '=' + queries[val] + ' AND ';
    }
    // Allowing random number of values -> this code seems pretty stupid
    let valStr = '';
    for (let value in infoJson) {
      valStr += value + '='
      valStr += '?, ';
    }
    valStr = valStr.substring(0, valStr.length - 2);
    queryString = queryString.substring(0, queryString.length - 5);
    const res = await conn.query(`UPDATE ${tableName} SET ${valStr} WHERE ${queryString}`, vals);
    console.log(res);
    conn.end();
    return 200;
  } catch (err) {
    console.log(err);
    return 400;
  }

}

async function getQuery(queries, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    var string = ''
    for (let val in queries) {
      string += val + ' = ' + queries[val] + ' AND ';
    }
    string = string.substring(0, string.length - 5);
    const dbRet = await conn.query(`SELECT * FROM ${tableName} WHERE ${string} `)
    conn.end();
    return dbRet;

  } catch (err) {
    console.log(err);
    return 400;
  }
}

// finds one row based on the id
async function findOne(classId, tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRet = await conn.query(`SELECT * FROM ${tableName} WHERE class_id = ${classId}`);
    conn.end();
    return dbRet;

  } catch (err) {
    console.log(err);
    return 400;
  }
}

// deletes all rows
async function deleteMany(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`DELETE FROM ${tableName}`);
    console.log(res);
    conn.end();
    return 200;

  } catch (err) {
    console.log(err);
    return 400;
  }
}


//TODO patch and put act the same way for now
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to PC_Timetable API',
  });
});

app.route('/classes')
// returns classes based on requests parameters
// or all classes if there are no parameters
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      getQuery(req.query, routeName)
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
      getMany(routeName)
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
    postOne(infoJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all classes
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
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
    updateOne(infoJson, queries, routeName)
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
    updateOne(infoJson, queries, routeName)
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


app.route('/classes/:classId')
// returns one class based on id
// TODO return all applicable classes based on the provided parameter
  .get((req, res) => {
    const routeName = req.route.path.split('/')[1];
    findOne(req.params.classId, routeName)
      .then((ret) => {
        if (ret) {
          res.send(ret);
        } else {
          res.status(400).json({
            message: 'There was an error processing your request',
          });
        }
      });
  });


app.route('/users')
// returns all users
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      getQuery(req.query, routeName)
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
      getMany(routeName)
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
// posts one user
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const userJson = (req.body);
    postOne(userJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all users
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
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
    updateOne(infoJson, queries, routeName)
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
    updateOne(infoJson, queries, routeName)
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

app.route('/students')
// returns all students
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      getQuery(req.query, routeName)
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
      getMany(routeName)
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
// posts one student
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const studentJson = (req.body);
    postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all students
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
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
    updateOne(infoJson, queries, routeName)
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
    updateOne(infoJson, queries, routeName)
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

app.route('/teachers')
// returns all teachers
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      getQuery(req.query, routeName)
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
      getMany(routeName)
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
// posts one teacher
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const studentJson = (req.body);
    postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all teachers
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
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
    updateOne(infoJson, queries, routeName)
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
    updateOne(infoJson, queries, routeName)
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

app.route('/classes_taken')
// returns all classes_taken
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      getQuery(req.query, routeName)
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
      getMany(routeName)
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
    postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all classes_taken
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
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
    updateOne(infoJson, queries, routeName)
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
    updateOne(infoJson, queries, routeName)
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

app.route('/classes_taught')
// returns all classes_taught
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      getQuery(req.query, routeName)
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
      getMany(routeName)
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
    postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all classes_taught
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
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
    updateOne(infoJson, queries, routeName)
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
    updateOne(infoJson, queries, routeName)
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

app.route('/classes_time')
// returns all classes_time
  .get((req, res) => {
    const routeName = req.route.path.replace('/', '');
    if (Object.keys(req.query).length !== 0) {
      getQuery(req.query, routeName)
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
      getMany(routeName)
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
// posts one classes_time row
  .post((req, res) => {
    const routeName = req.route.path.replace('/', '');
    const studentJson = (req.body);
    postOne(studentJson, routeName)
      .then((ret) => {
        res.sendStatus(ret);
      });
  })
// deletes all classes_time
  .delete((req, res) => {
    const routeName = req.route.path.replace('/', '');
    deleteMany(routeName)
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
    updateOne(infoJson, queries, routeName)
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
    updateOne(infoJson, queries, routeName)
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

app.listen(port, () => console.log(`API listening on port ${port}!`));
