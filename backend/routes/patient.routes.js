/*
*********************************************************************************************************
 *  @File Name        : patient.routes.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 12-12-2025 to 16-12-2025
 *  @Description      :
 *      Route definitions for patient-related APIs.
 *      Maps HTTP requests to corresponding
 *      patient controller methods.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DEPENDENCIES
 *  @Description :
 *      express      - Web framework for routing
 *      upload       - Multer middleware for file uploads
 *      controller   - Patient business logic handler
*********************************************************
*/
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const patientController = require('../controllers/patient.controller');


/*
*********************************************************
 *  ROUTE : GET /
 *  @Description :
 *      Fetches patient list with optional search query.
*********************************************************
*/
router.get('/', patientController.getPatients);


/*
*********************************************************
 *  ROUTE : POST /
 *  @Description :
 *      Creates a new patient record.
 *      Supports single image upload.
*********************************************************
*/
router.post('/', upload.single('image'), patientController.createPatient);


/*
*********************************************************
 *  MODULE EXPORT
 *  @Description :
 *      Exports patient routes for application use.
*********************************************************
*/
module.exports = router;
