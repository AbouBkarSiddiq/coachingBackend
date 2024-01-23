const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateUser = require('../middlewares/authenticateUser');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

// Admin route to update approval status of trainers and trainees
router.patch('/updateApprovalStatus', authenticateUser,authorizeAdmin,adminController.updateApprovalStatus);

module.exports = router;
