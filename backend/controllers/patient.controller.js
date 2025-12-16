/*
*********************************************************************************************************
 *  @File Name        : patient.controller.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Controller responsible for handling patient-related
 *      operations such as fetching patient list with search
 *      and creating new patient records.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DATABASE CONFIGURATION
 *  @Description :
 *      Imports MySQL database connection instance
 *      to execute patient-related queries.
*********************************************************
*/
const db = require('../config/dataBase');


/*
*********************************************************
 *  @Method Name    : getPatients
 *  @Description    :
 *      Fetches patient list from database.
 *      Supports search by patient name or phone number.
 *      Also returns count of active policies per patient.
 *  @param          : req (Request)
 *  @param          : res (Response)
*********************************************************
*/
exports.getPatients = (req, res) => {
    const search = req.query.q || '';

    const sql = `
        SELECT 
            p.id,
            p.name,
            p.phone,
            p.city,
            p.dob,
            p.email,
            p.image_url,
            COUNT(po.id) AS policies
        FROM patients p
        LEFT JOIN policies po 
            ON p.id = po.patient_id 
            AND po.status = 'Active'
        WHERE p.name LIKE ? OR p.phone LIKE ?
        GROUP BY p.id
    `;

    db.query(sql, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json([]);
        }
        res.json(results);
    });
};


/*
*********************************************************
 *  @Method Name    : createPatient
 *  @Description    :
 *      Creates a new patient record in the database.
 *      Supports optional patient image upload.
 *  @param          : req (Request)
 *  @param          : res (Response)
*********************************************************
*/
exports.createPatient = (req, res) => {
    const { firstName, lastName, phone, address, dob, email } = req.body;

    const imageUrl = req.file
        ? `/uploads/patients/${req.file.filename}`
        : null;

    const name = `${firstName} ${lastName}`;

    const sql = `
        INSERT INTO patients (name, phone, city, dob, email, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, phone, address, dob, email, imageUrl],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to add patient' });
            }

            res.json({
                message: 'Patient added successfully',
                patientId: result.insertId
            });
        }
    );
};
