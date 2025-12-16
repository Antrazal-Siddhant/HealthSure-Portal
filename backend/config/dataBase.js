/*
*********************************************************************************************************
 *  @File Name        : dataBase.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Database configuration module for HealthSure backend.
 *      Loads environment variables and establishes a MySQL
 *      database connection using mysql2.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  LOAD ENVIRONMENT VARIABLES
 *  @Description :
 *      Loads database credentials and configuration
 *      from .env file into process.env.
*********************************************************
*/
require('dotenv').config();


/*
*********************************************************
 *  IMPORT DEPENDENCIES
 *  @Description :
 *      mysql2 library is used to create
 *      and manage MySQL database connections.
*********************************************************
*/
const mysql = require('mysql2');


/*
*********************************************************
 *  DATABASE CONNECTION CONFIGURATION
 *  @Description :
 *      Creates MySQL connection using
 *      environment variables for security.
*********************************************************
*/
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


/*
*********************************************************
 *  DATABASE CONNECTION INITIALIZATION
 *  @Description :
 *      Attempts to establish a connection
 *      and logs success or failure.
*********************************************************
*/
db.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        return;
    }
    console.log('MySQL connected successfully');
});


/*
*********************************************************
 *  MODULE EXPORT
 *  @Description :
 *      Exports the database connection instance
 *      for reuse across backend modules.
*********************************************************
*/
module.exports = db;
