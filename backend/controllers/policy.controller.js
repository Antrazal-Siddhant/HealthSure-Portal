/*
*********************************************************************************************************
 *  @File Name        : policy.controller.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Controller responsible for handling policy-related operations
 *      including fetching policies for a patient, creating new policies,
 *      renewing existing policies, and cancelling active policies.
 *

 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DATABASE CONFIGURATION
 *  @Description :
 *      Imports MySQL database connection instance
 *      to execute policy-related queries.
*********************************************************
*/
const db = require('../config/dataBase');


/*
*********************************************************
 *  @Method Name    : getPoliciesByPatient
 *  @Description    :
 *      Fetches all policies associated with a given patient.
 *  @param          : req (Request)
 *  @param          : res (Response)
*********************************************************
*/
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



/*
*********************************************************
 *  @Method Name    : createPolicy
 *  @Description    :
 *      Creates a new policy record for a patient.
 *  @param          : req (Request)
 *  @param          : res (Response)
*********************************************************
*/
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




/*
*********************************************************
 *  @Method Name    : renewPolicy
 *  @Description    :
 *      Renews an existing policy by updating dates
 *      and setting status to Active.
 *  @param          : req (Request)
 *  @param          : res (Response)
*********************************************************
*/
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




/*
*********************************************************
 *  @Method Name    : cancelPolicy
 *  @Description    :
 *      Cancels an active policy and records
 *      the cancellation reason.
 *  @param          : req (Request)
 *  @param          : res (Response)
*********************************************************
*/
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
