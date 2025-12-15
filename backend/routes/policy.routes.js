const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy.controller');

router.get('/:patientId', policyController.getPoliciesByPatient);
router.post('/', policyController.createPolicy);
router.put('/:policyNo/renew', policyController.renewPolicy);
router.put('/:policyNo/cancel', policyController.cancelPolicy);

module.exports = router;
