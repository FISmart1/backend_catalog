const express = require('express');
const cors = require('cors');
const siswaRoutes = require('./routes/siswaRoutes');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// ===========================
// ✅ Auto Create DB & Table
// ===========================
const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // ganti jika ada
      multipleStatements: true,
    });

    // 1. Buat database jika belum ada
    await connection.query(`CREATE DATABASE IF NOT EXISTS db_bazma`);

    // 2. Gunakan database tersebut
    await connection.query(`USE db_bazma`);

    // 3. Baca dan jalankan isi schema.sql
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schema);

    console.log('✅ Database dan tabel berhasil dibuat/di-cek.');
    await connection.end();
  } catch (err) {
    console.error('❌ Gagal inisialisasi database:', err.message);
  }
};


// ===========================
// ✅ Jalankan Init DB saat start
// ===========================
initDatabase();

// ===========================
// ✅ Routing & API
// ===========================
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api', siswaRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/download/:filename", (req, res) => {
  const file = path.join(__dirname, "uploads", req.params.filename);
  res.download(file, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send("File not found");
    }
  });
});

// ===========================
// ✅ Start Server
// ===========================
const PORT = 3006;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

