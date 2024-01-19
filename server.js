const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js')
const trainerRoutes = require('./routes/trainerRoutes.js')
const uploadRoutes = require('./routes/uploadRoutes.js')
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world")
});

mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


app.use('/api/users', userRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/upload', uploadRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
