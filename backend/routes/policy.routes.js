/*
*********************************************************************************************************
 *  @File Name        : policy.routes.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Route definitions for policy-related APIs.
 *      Maps HTTP requests to corresponding
 *      policy controller methods.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DEPENDENCIES
 *  @Description :
 *      express        - Web framework for routing
 *      controller    - Policy business logic handler
*********************************************************
*/
const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy.controller');


/*
*********************************************************
 *  ROUTE : GET /:patientId
 *  @Description :
 *      Fetches all policies for a specific patient.
*********************************************************
*/
router.get('/:patientId', policyController.getPoliciesByPatient);


/*
*********************************************************
 *  ROUTE : POST /
 *  @Description :
 *      Creates a new policy record for a patient.
*********************************************************
*/
router.post('/', policyController.createPolicy);


/*
*********************************************************
 *  ROUTE : PUT /:policyNo/renew
 *  @Description :
 *      Renews an existing policy by updating dates.
*********************************************************
*/
router.put('/:policyNo/renew', policyController.renewPolicy);


/*
*********************************************************
 *  ROUTE : PUT /:policyNo/cancel
 *  @Description :
 *      Cancels an active policy with reason.
*********************************************************
*/
router.put('/:policyNo/cancel', policyController.cancelPolicy);


/*
*********************************************************
 *  MODULE EXPORT
 *  @Description :
 *      Exports policy routes for application use.
*********************************************************
*/
module.exports = router;
