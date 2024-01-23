const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const multer = require('multer');
const authenticateUser = require('../middlewares/authenticateUser');

const upload = multer({
  // storage: storage,
  // fileFilter: fileFilter,
});

// Ensure that the form or API sending the data has a file field named 'image'
router.post('/register', upload.single('image'), trainerController.registerTrainer);

// Other routes
router.delete('/:id', authenticateUser, trainerController.deleteTrainer);
router.patch('/:id', authenticateUser, trainerController.updateTrainer);
router.get('/all', trainerController.getAllTrainers);
router.get('/:id', trainerController.getSingleTrainer);
router.post('/login', trainerController.loginTrainer);

module.exports = router;
