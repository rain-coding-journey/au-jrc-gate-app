require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scanRoutes = require('./routes/scan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Route Registration
app.use('/api/v1/scan', scanRoutes);

// Healthcheck Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', campus: 'Arellano University JRC', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`AU JRC Gate Gateway active on port ${PORT}`);
});