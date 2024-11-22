const db = require('../config/db');

module.exports = {
  // Fetch all payment methods
  getAllPaymentMethods: async () => {
    try {
      const [results] = await db.query(`SELECT * FROM paymentmethod`);
      return results;
    } catch (error) {
      throw error;
    }
  },

  // Add a new payment method
  addPaymentMethod: async (paymentMethodData) => {
    const { method_name } = paymentMethodData;
    try {
      const result = await db.query(`INSERT INTO paymentmethod (method_name) VALUES (?)`, [method_name]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update a payment method
  updatePaymentMethod: async (id, paymentMethodData) => {
    const { method_name } = paymentMethodData;
    try {
      const result = await db.query(`UPDATE paymentmethod SET method_name = ? WHERE payment_method_id = ?`, [method_name, id]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Delete a payment method
  deletePaymentMethod: async (id) => {
    try {
      const result = await db.query(`DELETE FROM paymentmethod WHERE payment_method_id = ?`, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
