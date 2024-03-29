const mongoose = require('mongoose');
const Trainer = require('../models/trainerModel');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const jwt = require('jsonwebtoken');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerTrainer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      confirmPassword,
      email,
      phone,
      category,
      subCategory,
      gender,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({ error: 'Trainer already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl;
    const image = req.file; // The uploaded image buffer

    if (image) {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "coaching" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              imageUrl = result.secure_url;
              resolve();
            }
          }
        );
        streamifier.createReadStream(image.buffer).pipe(uploadStream);
      });
    }

    const trainer = new Trainer({
      firstName,
      lastName,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      email,
      phone,
      category,
      subCategory,
      gender,
      image: imageUrl
    });

    const data = await trainer.save();
    const token = jwt.sign({ id: trainer._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ message: 'Trainer registered successfully', data, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a trainer
const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const trainer = await Trainer.findByIdAndDelete(id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all trainers
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({});
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single trainer
const getSingleTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json({ message: 'Trainer found successfully', trainer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update trainer
const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const updates = req.body;
    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    Object.keys(updates).forEach((update) => (trainer[update] = updates[update]));

    await trainer.save();
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginTrainer = async (req, res) => {
  try {
      const { email, password } = req.body;

      const trainer = await Trainer.findOne({ email });
      if (!trainer) {
          return res.status(404).json({ error: 'Trainer not found' });
      }

      if (!trainer.isApproved) {
          return res.status(403).json({ error: 'Trainer not approved' });
      }

      const isMatch = await bcrypt.compare(password, trainer.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Create a sanitized trainer object without sensitive fields
      const sanitizedTrainer = {
          _id: trainer._id,
          firstName: trainer.firstName,
          lastName: trainer.lastName,
          email: trainer.email,
          isApproved: trainer.isApproved,
          role: trainer.role,
          phone: trainer.phone,
          category: trainer.category,
          subCategory: trainer.subCategory,
          gender: trainer.gender,
          image: trainer.image,
          
          // Add other fields you want to include in the response
      };

      // Trainer authenticated, proceed to login
      const token = jwt.sign({ id: trainer._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ message: 'Login successful', trainer: sanitizedTrainer, token });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


module.exports = {
  registerTrainer,
  deleteTrainer,
  updateTrainer,
  getAllTrainers,
  getSingleTrainer,
  loginTrainer
};
