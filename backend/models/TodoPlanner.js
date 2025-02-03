const mongoose = require('mongoose');

const todoPlannerSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming you have a 'User' model to associate with the TodoPlanner
  },
});

const TodoPlanner = mongoose.model('TodoPlanner', todoPlannerSchema);

module.exports = TodoPlanner;