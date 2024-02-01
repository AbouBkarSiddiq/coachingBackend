const Payment = require('../models/paymentModel');

const getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { paymentStatus: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({ totalRevenue: totalRevenue[0]?.total || 0 });
  } catch (error) {
    res.status(500).send({ message: "Error retrieving total revenue", error: error.message });
  }
};

module.exports = { getTotalRevenue };
