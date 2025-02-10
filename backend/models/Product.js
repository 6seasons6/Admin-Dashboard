const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this field exists
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
