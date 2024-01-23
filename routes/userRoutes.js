const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authenticateUser');

// Registration route
router.post('/register', userController.register);
router.delete('/:id', authenticateUser, userController.deleteUser);
router.patch('/:id',authenticateUser, userController.updateUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);
router.post('/login', userController.login);

module.exports = router;
