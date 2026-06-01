const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  companyName: { type: String },
  salutation: { type: String },
  batchId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { strict: false }); // strict: false allows saving dynamic attributes

module.exports = mongoose.model('Contact', contactSchema);
