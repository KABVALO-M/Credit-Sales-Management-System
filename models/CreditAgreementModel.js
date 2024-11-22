// models/creditAgreementModel.js
const db = require('../config/db');

const CreditAgreementModel = {
  // Function to get all credit agreements
  getAllAgreements: async () => {
    try {
      const [agreements] = await db.query(`
        SELECT ca.*, c.first_name, c.last_name, p.product_name 
        FROM creditagreement ca 
        JOIN customers c ON ca.customer_id = c.customer_id 
        JOIN products p ON ca.product_id = p.product_id
      `);
      return agreements;
    } catch (error) {
      throw error;
    }
  },

  // Function to add a new credit agreement
  addAgreement: async (agreementData) => {
    const { customer_id, product_id, quantity, total_amount, start_date, months_to_pay, monthly_installment, status } = agreementData;
    try {
      const result = await db.query(`
        INSERT INTO creditagreement 
        (customer_id, product_id, quantity, total_amount, start_date, months_to_pay, monthly_installment, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [customer_id, product_id, quantity, total_amount, start_date, months_to_pay, monthly_installment, status]
      );
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  // Function to update an existing credit agreement
  updateAgreement: async (agreement_id, agreementData) => {
    const { customer_id, product_id, total_amount, start_date, months_to_pay, monthly_installment, status } = agreementData;
    try {
      const result = await db.query(`
        UPDATE creditagreement 
        SET customer_id = ?, product_id = ?, total_amount = ?, start_date = ?, months_to_pay = ?, monthly_installment = ?, status = ?
        WHERE agreement_id = ?`, 
        [customer_id, product_id, total_amount, start_date, months_to_pay, monthly_installment, status, agreement_id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Function to delete a credit agreement
  deleteAgreement: async (agreement_id) => {
    try {
      const result = await db.query('DELETE FROM creditagreement WHERE agreement_id = ?', [agreement_id]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Function to get recent credit agreements
  getRecentAgreements: async () => {
    try {
      const [recentAgreements] = await db.query(`
        SELECT ca.*, c.first_name, c.last_name, p.product_name 
        FROM creditagreement ca
        JOIN customers c ON ca.customer_id = c.customer_id
        JOIN products p ON ca.product_id = p.product_id
        ORDER BY ca.agreement_id DESC
        LIMIT 5
      `); // Limit to 5 recent agreements
      return recentAgreements;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = CreditAgreementModel;
