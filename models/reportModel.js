const db = require('../config/db'); // Assuming db is configured correctly

const ReportModel = {
    // Get the report of unpaid credit agreements
    getUnpaidAgreements: async () => {
        try {
            const [results] = await db.query(`
                SELECT 
                    cu.first_name,
                    cu.last_name,
                    p.product_name,
                    ca.quantity,
                    p.price AS unit_price,
                    (ca.quantity * p.price) AS total_price,
                    ca.start_date,
                    ca.months_to_pay,
                    ca.monthly_installment,

                    -- Calculate the total paid by the customer
                    IFNULL(SUM(pay.amount_paid), 0) AS total_paid,

                    -- Calculate the remaining balance
                    ((ca.quantity * p.price) - IFNULL(SUM(pay.amount_paid), 0)) AS balance_remaining,

                    -- Determine the payable amount (either monthly installment or remaining balance)
                    CASE
                        WHEN ((ca.quantity * p.price) - IFNULL(SUM(pay.amount_paid), 0)) > ca.monthly_installment 
                        THEN ca.monthly_installment
                        ELSE ((ca.quantity * p.price) - IFNULL(SUM(pay.amount_paid), 0))
                    END AS payable_amount

                FROM 
                    creditagreement ca
                JOIN 
                    customers cu ON ca.customer_id = cu.customer_id
                JOIN 
                    products p ON ca.product_id = p.product_id
                JOIN 
                    sales s ON ca.agreement_id = s.agreement_id  -- Join with the sales table to ensure the sale has been made
                LEFT JOIN 
                    payments pay ON ca.agreement_id = pay.agreement_id
                WHERE 
                    ca.status = 'Active'
                    AND (CURRENT_DATE BETWEEN ca.start_date AND DATE_ADD(ca.start_date, INTERVAL ca.months_to_pay MONTH))
                GROUP BY 
                    ca.agreement_id
                HAVING 
                    ((ca.quantity * p.price) - IFNULL(SUM(pay.amount_paid), 0)) > 0
                ORDER BY 
                    cu.last_name, cu.first_name;

            `);
            return results; // Return the results as an array
        } catch (error) {
            console.error('Error fetching unpaid agreements report:', error);
            throw error; // Throw error for further handling
        }
    }
};

module.exports = ReportModel;
