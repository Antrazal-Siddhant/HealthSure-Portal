const db = require('../config/dataBase');

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
