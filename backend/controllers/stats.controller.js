/*
*********************************************************************************************************
 *  @File Name        : stats.controller.js
 *  @Author           : <Siddhant Mahato>
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Controller responsible for fetching policy statistics
 *      such as active, cancelled, expired, and soon-to-expire
 *      policies for dashboard display.
 *
 *********************************************************************************************************
*/


/*
*********************************************************
 *  IMPORT DATABASE CONFIGURATION
 *  @Description :
 *      Imports MySQL database connection instance
 *      to execute statistics-related queries.
*********************************************************
*/
const db = require('../config/dataBase');


/*
*********************************************************
 *  @Method Name    : getPolicyStats
 *  @Description    :
 *      Fetches aggregated policy statistics from database.
 *      Calculates counts for active, cancelled, expired,
 *      and policies expiring within next 30 days.
 *  @param          : req (Request)
 *  @param          : res (Response)
*********************************************************
*/
exports.getPolicyStats = (req, res) => {

    const sql = `
        SELECT
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled,
            SUM(CASE WHEN status = 'Expired' THEN 1 ELSE 0 END) AS expired,
            SUM(
                CASE 
                    WHEN status = 'Active'
                    AND end_date BETWEEN CURDATE() 
                    AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
                    THEN 1 ELSE 0
                END
            ) AS expiringSoon
        FROM policies
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                active: 0,
                cancelled: 0,
                expired: 0,
                expiringSoon: 0
            });
        }

        res.json(results[0]);
    });
};
