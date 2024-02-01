const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Trainer'
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Program' 
  },
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['success', 'failed', 'pending']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
