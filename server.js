const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js')
const trainerRoutes = require('./routes/trainerRoutes.js')
const uploadRoutes = require('./routes/uploadRoutes.js')
const programRoutes = require('./routes/programRoutes.js')
const adminRoutes = require('./routes/adminRoutes.js')
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']
};
app.use(cors(corsOptions));

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
app.use('/api', programRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
