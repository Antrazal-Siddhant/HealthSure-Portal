/*
*********************************************************************************************************
 *  @File Name        : upload.middleware.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Middleware responsible for handling file uploads
 *      using multer. Configures disk storage for patient
 *      image uploads with dynamic file naming.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DEPENDENCIES
 *  @Description :
 *      multer is used for handling multipart/form-data.
 *      path is used to extract file extensions.
*********************************************************
*/
const multer = require('multer');
const path = require('path');


/*
*********************************************************
 *  MULTER STORAGE CONFIGURATION
 *  @Description :
 *      Defines destination folder and filename
 *      generation strategy for uploaded files.
*********************************************************
*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/patients');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


/*
*********************************************************
 *  MODULE EXPORT
 *  @Description :
 *      Exports configured multer instance
 *      to be used as upload middleware.
*********************************************************
*/
module.exports = multer({ storage });
