const express = require('express');
const cors = require('cors');
const siswaRoutes = require('./routes/siswaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', siswaRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
