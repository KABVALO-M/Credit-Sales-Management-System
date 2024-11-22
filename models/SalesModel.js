// models/salesModel.js
const db = require('../config/db');

const SalesModel = {
  // Get all sales
  getAllSales: async () => {
    try {
      const [sales] = await db.query(`
        SELECT sales.sale_id, products.product_name, customers.first_name, customers.last_name, credit_agreement.quantity, sales.total_amount, sales.sale_date
        FROM Sales sales
        JOIN CreditAgreement credit_agreement ON sales.agreement_id = credit_agreement.agreement_id
        JOIN Products products ON credit_agreement.product_id = products.product_id
        JOIN Customers customers ON credit_agreement.customer_id = customers.customer_id
      `);
      return sales;
    } catch (error) {
      throw error;
    }
  },

  // Add a new sale
  addSale: async (saleData) => {
    // Destructure necessary fields from saleData
    const { agreement_id, agreement_total } = saleData;

    try {
        const result = await db.query(
            `INSERT INTO sales (agreement_id, total_amount, sale_date) 
            VALUES (?, ?, NOW())`,  // Use NOW() to set the sale_date automatically
            [agreement_id, agreement_total]
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error; // Rethrow the error to be handled in the controller
    }
  },

  // Update an existing sale
  updateSale: async (sale_id, saleData) => {
    const { product_id, customer_id, quantity, total_amount, sale_date } = saleData;

    try {
      const result = await db.query(
        `UPDATE sales 
         SET product_id = ?, customer_id = ?, quantity = ?, total_amount = ?, sale_date = ? 
         WHERE sale_id = ?`,
        [product_id, customer_id, quantity, total_amount, sale_date, sale_id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Delete a sale
  deleteSale: async (sale_id) => {
    try {
      const result = await db.query('DELETE FROM sales WHERE sale_id = ?', [sale_id]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get all agreements where no sale has been made
  getAgreementsWithoutSales: async () => {
    try {
      const [results] = await db.query(`
        SELECT 
          credit_agreement.agreement_id, 
          credit_agreement.quantity,
          credit_agreement.monthly_installment,
          credit_agreement.months_to_pay,
          credit_agreement.total_amount AS agreement_total_amount, 
          credit_agreement.status AS agreement_status,
          customers.customer_id, 
          customers.first_name, 
          customers.last_name, 
          customers.employment_number,
          products.product_id, 
          products.product_name, 
          products.price AS product_price
        FROM creditagreement credit_agreement
        JOIN customers ON credit_agreement.customer_id = customers.customer_id
        JOIN products ON credit_agreement.product_id = products.product_id
        LEFT JOIN sales ON credit_agreement.agreement_id = sales.agreement_id
        WHERE sales.sale_id IS NULL
      `);
      return results; // Return the agreements without sales
    } catch (error) {
      console.error('Error fetching agreements without sales:', error);
      throw error;
    }
  },
  
};

module.exports = SalesModel;
