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

const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
