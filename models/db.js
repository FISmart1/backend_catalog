require('dotenv').config(); // Load .env file

const mysql = require('mysql2/promise'); // Menggunakan promise pool

console.log('Coba konek ke DB dengan host:', process.env.DB_HOST);

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_bazma',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(() => {
    console.log("✅ Berhasil konek ke MySQL!");
  })
  .catch((err) => {
    console.error("❌ Gagal konek ke MySQL:", err.message);
  });

module.exports = pool;
