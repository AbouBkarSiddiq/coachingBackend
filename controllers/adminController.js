const Trainer = require('../models/trainerModel'); 
const Trainee = require('../models/userModel');

exports.updateApprovalStatus = async (req, res) => {
  try {
    const { userId, role, isApproved } = req.body;

    let user;
    if (role === 'trainer') {
      user = await Trainer.findByIdAndUpdate(userId, { isApproved }, { new: true });
    } else if (role === 'trainee') {
      user = await Trainee.findByIdAndUpdate(userId, { isApproved }, { new: true });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User approval status updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
