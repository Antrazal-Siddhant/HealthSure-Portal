const db = require('../config/dataBase');


exports.getPoliciesByPatient = (req, res) => {
    const patientId = req.params.patientId;

    const sql = `
        SELECT 
            policy_no,
            plan,
            sum_insured,
            start_date,
            end_date,
            status
        FROM policies
        WHERE patient_id = ?
    `;

    db.query(sql, [patientId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json([]);
        }
        res.json(results);
    });
};



exports.createPolicy = (req, res) => {
    const {
        patientId,
        policyNo,
        plan,
        sumInsured,
        startDate,
        endDate,
        status
    } = req.body;

    const sql = `
        INSERT INTO policies 
        (patient_id, policy_no, plan, sum_insured, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [patientId, policyNo, plan, sumInsured, startDate, endDate, status],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to add policy' });
            }

            res.json({ message: 'Policy added successfully' });
        }
    );
};




exports.renewPolicy = (req, res) => {
    const { policyNo } = req.params;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Dates required' });
    }

    db.query(
        `SELECT status FROM policies WHERE policy_no = ?`,
        [policyNo],
        (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Policy not found' });
            }

            if (results[0].status === 'Cancelled') {
                return res.status(400).json({
                    message: 'Cancelled policies cannot be renewed'
                });
            }

            db.query(
                `UPDATE policies 
                 SET status = 'Active',
                     start_date = ?,
                     end_date = ?
                 WHERE policy_no = ?`,
                [startDate, endDate, policyNo],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Renew failed' });
                    }
                    res.json({ message: 'Policy renewed successfully' });
                }
            );
        }
    );
};




exports.cancelPolicy = (req, res) => {
    const { policyNo } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({ message: 'Cancel reason required' });
    }

    db.query(
        `SELECT status FROM policies WHERE policy_no = ?`,
        [policyNo],
        (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Policy not found' });
            }

            if (results[0].status !== 'Active') {
                return res.status(400).json({
                    message: 'Only active policies can be cancelled'
                });
            }

            db.query(
                `UPDATE policies 
                 SET status = 'Cancelled',
                     cancel_reason = ?
                 WHERE policy_no = ?`,
                [reason, policyNo],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Cancel failed' });
                    }
                    res.json({ message: 'Policy cancelled successfully' });
                }
            );
        }
    );
};
