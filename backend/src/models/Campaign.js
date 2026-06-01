const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  htmlTemplate: { type: String, required: true },
  status: { type: String, enum: ['draft', 'sending', 'completed', 'failed'], default: 'draft' },
  totalSent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);