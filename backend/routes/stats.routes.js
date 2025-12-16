/*
*********************************************************************************************************
 *  @File Name        : stats.routes.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Route definitions for statistics-related APIs.
 *      Provides endpoints for fetching policy
 *      summary metrics used in dashboard.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DEPENDENCIES
 *  @Description :
 *      express         - Web framework for routing
 *      controller     - Statistics business logic handler
*********************************************************
*/
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');


/*
*********************************************************
 *  ROUTE : GET /policy-stats
 *  @Description :
 *      Fetches aggregated policy statistics
 *      for dashboard display.
*********************************************************
*/
router.get('/policy-stats', statsController.getPolicyStats);


/*
*********************************************************
 *  MODULE EXPORT
 *  @Description :
 *      Exports stats routes for application use.
*********************************************************
*/
module.exports = router;
