const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Corrected ObjectId type
  daily: { type: Number, default: 0 },
  monthly: { type: Number, default: 0 },
  yearly: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now } // Using Date instead of String
});

module.exports = mongoose.model('Usage', usageSchema);
