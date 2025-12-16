/*
*********************************************************************************************************
 *  @File Name        : server.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 09-12-2025 to 16-12-2025
 *  @Description      :
 *      Entry point for HealthSure backend application.
 *      Initializes Express server, configures middleware,
 *      registers API routes, and starts the HTTP server.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DEPENDENCIES
 *  @Description :
 *      express - Web framework for Node.js
 *      cors    - Enables Cross-Origin Resource Sharing
*********************************************************
*/
const express = require('express');
const cors = require('cors');


/*
*********************************************************
 *  IMPORT ROUTE MODULES
 *  @Description :
 *      Loads route handlers for patients, policies,
 *      and statistics APIs.
*********************************************************
*/
const patientRoutes = require('./routes/patient.routes');
const policyRoutes = require('./routes/policy.routes');
const statsRoutes = require('./routes/stats.routes');


/*
*********************************************************
 *  DATABASE INITIALIZATION
 *  @Description :
 *      Initializes MySQL database connection.
*********************************************************
*/
require('./config/dataBase');


/*
*********************************************************
 *  EXPRESS APPLICATION INITIALIZATION
*********************************************************
*/
const app = express();


/*
*********************************************************
 *  GLOBAL MIDDLEWARE CONFIGURATION
 *  @Description :
 *      Enables CORS, JSON parsing, URL encoding,
 *      and static file serving for uploads.
*********************************************************
*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ REQUIRED
app.use('/uploads', express.static('uploads'));


/*
*********************************************************
 *  HEALTH CHECK ENDPOINT
 *  @Description :
 *      Used to verify backend server availability.
*********************************************************
*/
app.get('/test', (req, res) => {
    res.send('Backend is working');
});


/*
*********************************************************
 *  ROUTE REGISTRATION
 *  @Description :
 *      Registers API routes with base paths.
*********************************************************
*/
app.use('/patients', patientRoutes);
app.use('/policies', policyRoutes);
app.use('/', statsRoutes);


/*
*********************************************************
 *  SERVER STARTUP
 *  @Description :
 *      Starts backend server on port 3000.
*********************************************************
*/
app.listen(3000, () => {
    console.log('Backend server running on port 3000');
});
