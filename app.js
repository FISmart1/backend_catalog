const express = require('express');
const cors = require('cors');
const siswaRoutes = require('./routes/siswaRoutes');
const path = require('path');
const bodyParser = require('body-parser')





const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api', siswaRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/download/:filename", (req, res) => {
  const file = path.join(__dirname, "uploads", req.params.filename);
  console.log("Requested file:", file); // Debug path

  res.download(file, (err) => {
    if (err) {
      console.error("Download error:", err); // Cek kesalahan
      res.status(404).send("File not found");
    }
  });
});

// Endpoint untuk validasi



const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
