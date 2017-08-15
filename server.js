const express = require('express');
const { Client } = require('pg');

const app = express();

require('dotenv').config();

app.get('/api/hello/:name?', function(req, res) {
  // let name = '';
  // if (req.params.name) {
  //   name = req.params.name;
  // } else {
  //   name = 'What is your name?';
  // }
  res.json({ hello: req.params.name || 'What is your name?' });
});

app.get('/api/students', function(req, res) {
  const client = new Client();

  client
    .connect()
    .then(() => {
      const sql = 'SELECT * FROM student';

      return client.query(sql);
    })
    .then(results => {
      res.json(results.rows);
    });
});

app.get('/api/students/:id', (req, res) => {
  const client = new Client();

  client
    .connect()
    .then(() => {
      const sql = 'SELECT * FROM student WHERE student_id = $1';
      const params = [req.params.id];

      return client.query(sql, params);
    })
    .then(result => {
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({
          'error: ': `Student ${req.params.id} does not exist.`
        });
      }
    })
    .catch(err => {
      res.status(500).send('broke');
    });
});

app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
