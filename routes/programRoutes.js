const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const authenticateUser = require('../middlewares/authenticateUser');

router.post('/programs', authenticateUser,  programController.createProgram);

router.get('/programs', programController.getAllPrograms);

router.get('/programs/:id', programController.getProgramById);

router.put('/programs/:id', authenticateUser, programController.updateProgram);

router.delete('/programs/:id', authenticateUser, programController.deleteProgram);

module.exports = router;
