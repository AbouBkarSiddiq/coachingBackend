const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
});

module.exports = mongoose.model('Program', programSchema);