const db = require('../config/db');

module.exports = {
  // Fetch all payments
  getAllPayments: async () => {
    try {
      const [results] = await db.query(`
        SELECT 
          p.payment_id,
          p.payment_date,
          p.amount_paid,
          pm.method_name AS payment_method,
          CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
          pr.product_name,
          ca.total_amount,
          ca.monthly_installment
        FROM payments p
        JOIN paymentmethod pm ON p.payment_method_id = pm.payment_method_id
        JOIN creditagreement ca ON p.agreement_id = ca.agreement_id
        JOIN customers c ON ca.customer_id = c.customer_id
        JOIN products pr ON ca.product_id = pr.product_id
      `);
      return results;
    } catch (error) {
      throw error;
    }
  },

  // Add a new payment
  addPayment: async (paymentData) => {
    const { agreement_id, amount_paid, payment_date, payment_method } = paymentData;
    try {
      const result = await db.query(
        `INSERT INTO payments (agreement_id, payment_date, amount_paid, payment_method_id) 
         VALUES (?, ?, ?, ?)`,
        [agreement_id, payment_date, amount_paid, payment_method]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update a payment
  updatePayment: async (id, paymentData) => {
    const { amount_paid, payment_method_id } = paymentData;
    try {
      const result = await db.query(
        `UPDATE payments SET amount_paid = ?, payment_method_id = ? WHERE payment_id = ?`,
        [amount_paid, payment_method_id, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Delete a payment
  deletePayment: async (id) => {
    try {
      const result = await db.query(`DELETE FROM payments WHERE payment_id = ?`, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Fetch payment methods
  getPaymentMethods: async () => {
    try {
      const [results] = await db.query(`SELECT * FROM paymentmethod`);
      return results;
    } catch (error) {
      throw error;
    }
  },

  // Fetch sales with outstanding payments (less than total amount)
  getOutstandingPayments: async () => {
    try {
      const [results] = await db.query(`
        SELECT 
            s.sale_id,
            ca.agreement_id,
            c.first_name,
            c.last_name,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            c.employment_number,
            p.product_name,
            ca.quantity,
            ca.total_amount AS agreement_total_amount,
            s.total_amount AS sale_total_amount,
            IFNULL(SUM(pay.amount_paid), 0) AS total_paid,
            (s.total_amount - IFNULL(SUM(pay.amount_paid), 0)) AS amount_due, 
            ca.status AS agreement_status,
            MAX(pay.payment_date) AS last_payment_date
        FROM 
            sales s
        JOIN 
            creditagreement ca ON s.agreement_id = ca.agreement_id
        JOIN 
            customers c ON ca.customer_id = c.customer_id
        JOIN 
            products p ON ca.product_id = p.product_id
        LEFT JOIN 
            payments pay ON ca.agreement_id = pay.agreement_id
        GROUP BY 
            s.sale_id, ca.agreement_id, c.customer_id, p.product_name
        HAVING 
            s.total_amount > IFNULL(SUM(pay.amount_paid), 0)
        ORDER BY 
            s.sale_id;

      `);
      return results;
    } catch (error) {
      throw error;
    }
  }
};
