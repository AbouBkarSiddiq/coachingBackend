const mongoose = require('mongoose');
const User = require('../models/userModel'); // Adjust the path according to your project structure
const bcrypt = require('bcryptjs');

// Registration controller
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, isApproved } = req.body;
    console.log(fullName, email, password, confirmPassword);
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email,
      isApproved,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    // Save the user
    const data = await user.save();
    res.status(201).json({ message: 'User registered successfully', data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const user = await User.findByIdAndDelete(id);
    console.log(user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get single user
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const updates = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.keys(updates).forEach((update) => user[update] = updates[update]);

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login controller
const login = async (req, res) => {
  try {
      const { email, password, role } = req.body;

      // Find the user by email and role
      const user = await User.findOne({ email, role });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if user is approved
      if (!user.isApproved) {
          return res.status(403).json({ error: 'User not approved' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Create a sanitized user object without sensitive fields
      const sanitizedUser = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          isApproved: user.isApproved,
          role: user.role,
          // Add other fields you want to include in the response
      };

      // User authenticated, proceed to login
      // Here you might want to generate a token or a session
      res.json({ message: 'Login successful', user: sanitizedUser });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



module.exports = {
  register,
  deleteUser,
  updateUser,
  getAllUsers,
  getSingleUser,
  login
};