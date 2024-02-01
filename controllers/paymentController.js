const Payment = require('../models/paymentModel'); 
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SK);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      // Additional parameters can be added here
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("Error in create-payment-intent:", error);
    res.status(500).send({ error: error.message });
  }
};

const handleSuccessfulPayment = async (req, res) => {
  try {
    const { programId, trainerId, amount } = req.body;

    // Create a new payment record
    const newPayment = new Payment({
      trainerId,
      programId,
      amount,
      paymentStatus: 'success',
      paymentDate: new Date()
    });

    await newPayment.save();

    res.status(200).json({ message: "Payment recorded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  handleSuccessfulPayment
};
