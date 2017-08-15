let { Client } = require('pg');
let fs = require('fs');

require('dotenv').config();

//Read in the script.
let sql = fs.readFileSync('./db/datascript.sql', 'utf8');
//Get what we set PGDATABASE in the .env file.
let originalDatabase = process.env.PGDATABASE;

//Set PGDATABASE to postgres so we can create the DB if it doesn't exist.
process.env.PGDATABASE = 'postgres';

let databaseCheckClient = new Client();
databaseCheckClient
  .connect()
  .then(function() {
    let sql = 'SELECT * FROM pg_database where datname = $1';
    let params = [originalDatabase];
    return databaseCheckClient.query(sql, params);
  })
  .then(function(result) {
    if (result.rows.length === 0) {
      let sql = `CREATE DATABASE ${originalDatabase}`;
      return databaseCheckClient.query(sql);
    }
    return null;
  })
  .then(function(result) {
    if (result === null) {
      console.log(`${originalDatabase} already exists.`);
    } else {
      console.log(`Created database ${originalDatabase}`);
    }

    databaseCheckClient.end();
    process.env.PGDATABASE = originalDatabase;
    return;
  })
  .then(function() {
    //Run the database schema scripts now that we have an actual database.
    let client = new Client();
    client
      .connect()
      .then(function() {
        return client.query(sql);
      })
      .then(function() {
        console.log('Finished running the seeding script.');
        client.end();
      });
  });
