const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './smart/'); // Make sure the 'smart/' directory exists
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  // storage: storage,
  // fileFilter: fileFilter,
});

// Ensure that the form or API sending the data has a file field named 'image'
router.post('/register', upload.single('image'), trainerController.registerTrainer);

// Other routes
router.delete('/:id', trainerController.deleteTrainer);
router.get('/all', trainerController.getAllTrainers);
router.get('/:id', trainerController.getSingleTrainer);
router.patch('/:id', trainerController.updateTrainer);

module.exports = router;
