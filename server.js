const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

require('dotenv').config();

app.use(express.static('public'));

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

app.post('/api/teachers', function(req, res) {
  console.log(req.body.firstName, req.body.lastName);

  const client = new Client();

  client
    .connect()
    .then(() => {
      let sql = 'INSERT INTO teacher (first_name, last_name) VALUES ($1, $2)';
      let params = [req.body.firstName, req.body.lastName];

      return client.query(sql, params);
    })
    .then(results => {
      res.status(201).json(results);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    })
    .then(() => {
      client.end();
    });
});

app.get('/api/teachers', function(req, res) {
  const client = new Client();

  client
    .connect()
    .then(() => {
      const sql = `select
                    teacher.teacher_id,
                    teacher.first_name,
                    teacher.last_name,
                    count(subject_id) as subjects_taught
                  from teacher
                  left join subject on teacher.teacher_id = subject.teacher_id
                  group by teacher.teacher_id, teacher.first_name, teacher.last_name`;

      return client.query(sql);
    })
    .then(results => {
      res.json(results.rows);
    });
});

app.get('/api/teachers/:id', (req, res) => {
  const client = new Client();

  client
    .connect()
    .then(() => {
      const sql = 'SELECT * FROM teacher WHERE teacher_id = $1';
      const params = [req.params.id];

      return client.query(sql, params);
    })
    .then(result => {
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({
          'error: ': `Teacher ${req.params.id} does not exist.`
        });
      }
    })
    .catch(err => {
      res.status(500).send('broke');
    });
});

app.get('/api/teachers/:id/subjects', (req, res) => {
  const client = new Client();

  client
    .connect()
    .then(() => {
      let sql = 'SELECT * FROM subject WHERE teacher_id = $1';
      let params = [req.params.id];

      return client.query(sql, params);
    })
    .then(results => {
      res.json(results.rows);
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      client.end();
    });
});

app.post('/api/subjects', function(req, res) {
  let client = new Client();

  client
    .connect()
    .then(() => {
      let sql =
        'INSERT INTO subject (subject_name, teacher_id) VALUES ($1, $2)';
      let params = [req.body.subjectName, req.body.teacherId];

      return client.query(sql, params);
    })
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    })
    .then(() => {
      client.end();
    });
});

app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
