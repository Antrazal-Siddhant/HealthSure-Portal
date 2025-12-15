const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const patientController = require('../controllers/patient.controller');

router.get('/', patientController.getPatients);
router.post('/', upload.single('image'), patientController.createPatient);

module.exports = router;
