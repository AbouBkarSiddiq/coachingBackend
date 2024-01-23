const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust with your User model

const authorizeAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = user; // or just req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authorizeAdmin;
