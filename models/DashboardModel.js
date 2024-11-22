const db = require('../config/db');

const DashboardModel = {
  // Fetch total customers
  getTotalCustomers: async () => {
    try {
      const [result] = await db.query('SELECT COUNT(*) AS count FROM Customers');
      return result[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Fetch total sales
  getTotalSales: async () => {
    try {
      const [result] = await db.query('SELECT SUM(total_amount) AS total FROM Sales');
      return result[0].total || 0; // Return 0 if no sales data
    } catch (error) {
      throw error;
    }
  },

  // Fetch total products
  getTotalProducts: async () => {
    try {
      const [result] = await db.query('SELECT COUNT(*) AS count FROM Products');
      return result[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Fetch total stock levels by calculating from transactions
  getTotalStock: async () => {
    try {
      // Fetch initial stock levels from ProductStock table
      const [initialStockResult] = await db.query('SELECT SUM(quantity_in_stock) AS initial_total FROM ProductStock');
      const initialTotalStock = initialStockResult[0].initial_total || 0;

      // Calculate adjustments from StockTransactions
      const [adjustmentsResult] = await db.query(`
        SELECT SUM(CASE WHEN transaction_type = 'addition' THEN quantity ELSE -quantity END) AS total_adjustments
        FROM StockTransactions
      `);

      const totalAdjustments = adjustmentsResult[0].total_adjustments || 0;

      return initialTotalStock + totalAdjustments;
    } catch (error) {
      throw error;
    }
  },

  // Fetch total payments
  getTotalPayments: async () => {
    try {
      const [result] = await db.query('SELECT SUM(amount_paid) AS total FROM Payments');
      return result[0].total || 0; // Return 0 if no payment data
    } catch (error) {
      throw error;
    }
  },

  // Calculate weekly growth for a specific category
  calculateWeeklyGrowth: async (table, column, dateColumn) => {
    try {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 7); // 7 days ago
      const formattedBaseDate = baseDate.toISOString().split('T')[0];

      // Query for current week data
      const currentDataQuery = `
        SELECT SUM(${column}) AS total
        FROM ${table}
        WHERE ${dateColumn} >= CURDATE() - INTERVAL 7 DAY
      `;

      // Query for previous week data
      const previousDataQuery = `
        SELECT SUM(${column}) AS total
        FROM ${table}
        WHERE ${dateColumn} BETWEEN '${formattedBaseDate}' AND CURDATE() - INTERVAL 7 DAY
      `;

      const [currentData] = await db.query(currentDataQuery);
      const [previousData] = await db.query(previousDataQuery);

      const currentTotal = currentData[0].total || 0;
      const previousTotal = previousData[0].total || 0;
      const growth = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

      return growth.toFixed(2); // Return formatted growth value
    } catch (error) {
      throw error;
    }
  },

  // Fetch recent sales data
  getRecentSales: async () => {
    try {
      const query = `
        SELECT 
          c.customer_id, 
          CONCAT(c.first_name, ' ', c.last_name) AS customer_name, 
          c.employment_number, 
          p.product_name, 
          p.price AS unit_price,  -- Get unit price from the Product table
          ca.total_amount / p.price AS quantity,  -- Calculate quantity from the total amount in CreditAgreement
          s.total_amount AS price,  -- Total amount from Sales
          s.sale_date AS sale_date
        FROM sales s
        INNER JOIN creditagreement ca ON s.agreement_id = ca.agreement_id  -- Join with CreditAgreement
        INNER JOIN customers c ON ca.customer_id = c.customer_id  -- Join with Customer
        INNER JOIN products p ON ca.product_id = p.product_id -- Join with Product
        ORDER BY s.sale_date DESC
        LIMIT 10;  -- Get the 10 most recent sales
      `;

      const [result] = await db.query(query);
      return result;
    } catch (error) {
      throw error;
    }
  },


  // Convenience methods for growth calculations
  calculateCustomerGrowth: function () {
    return this.calculateWeeklyGrowth('Customers', 'customer_id', 'created_at');
  },

  calculateSalesGrowth: function () {
    return this.calculateWeeklyGrowth('Sales', 'total_amount', 'sale_date');
  },

  calculateStockGrowth: function () {
    return this.calculateWeeklyGrowth('StockTransactions', 'quantity', 'transaction_date');
  },

  calculateProductGrowth: function () {
    return this.calculateWeeklyGrowth('Products', 'product_id', 'created_at');
  },

  calculatePaymentsGrowth: function () {
    return this.calculateWeeklyGrowth('Payments', 'amount_paid', 'payment_date');
  },
};

module.exports = DashboardModel;
