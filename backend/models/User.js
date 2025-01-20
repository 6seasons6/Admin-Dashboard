const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  monthlyData: { type: Number, default: 0 }, // Example field
  dailyData: { type: Number, default: 0 },  // Example field
  yearlyData: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
