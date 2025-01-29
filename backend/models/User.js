const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  monthlyData: { type: Number, default: 0 }, // Monthly usage in hours
  dailyData: { type: Number, default: 0 },   // Daily usage in hours
  yearlyData: { type: Number, default: 0 },  // Yearly usage in hours
  lastLogin: { type: Date, default: Date.now }, // Track last login to reset daily data
}, { timestamps: true });

// Check if the model already exists to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User ', userSchema);
module.exports = User;