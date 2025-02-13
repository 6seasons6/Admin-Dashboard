const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,  // Unique identifier
  name: String,
  email: { type: String, unique: true, required: true }, // Ensures each customer has a unique email
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  locationType: { type: String, enum: ['Urban', 'Rural'] },
  isActive: Boolean,  // Helps track churned customers
  purchaseHistory: [{ amount: Number, date: Date }],
  returns: [{ reason: String, count: Number }]
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
