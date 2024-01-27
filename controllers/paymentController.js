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

module.exports = {
    createPaymentIntent
};
