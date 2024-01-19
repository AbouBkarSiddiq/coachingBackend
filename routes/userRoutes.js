const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registration route
router.post('/register', userController.register);
router.delete('/:id', userController.deleteUser);
router.patch('/:id', userController.updateUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);
router.post('/login', userController.login);

module.exports = router;
