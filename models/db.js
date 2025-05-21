const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // sesuaikan dengan password MySQL kamu
  database: 'db_bazma',
});

module.exports = pool;
