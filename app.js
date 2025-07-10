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

