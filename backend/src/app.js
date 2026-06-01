const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const campaignRoutes = require('./routes/campaignRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/campaigns', campaignRoutes);
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
