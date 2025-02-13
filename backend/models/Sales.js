const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true }, // price * quantity
    date: { type: Date, default: Date.now },
    region: { type: String, required: true },
});

module.exports = mongoose.model('Sale', SaleSchema);
