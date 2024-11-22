const db = require('../config/db');

const ProductModel = {
  // Get all products with category names
  getAllProducts: async () => {
    try {
        const [results] = await db.query(`
            SELECT p.*, c.category_name
            FROM Products p
            JOIN ProductCategory c ON p.category_id = c.category_id
        `);
        return results; // Ensure this is an array
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
},

  // Add a new product
  addProduct: async (productData) => {
    try {
      const { product_name, product_description, price, category_id } = productData;
      const [result] = await db.query(
        'INSERT INTO Products (product_name, product_description, price, category_id) VALUES (?, ?, ?, ?)',
        [product_name, product_description, price, category_id]
      );
      return result; // Return the result of the insert operation
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product by id
  updateProduct: async (product_id, productData) => {
    try {
      const { product_name, product_description, price, category_id } = productData;
      const [result] = await db.query(
        'UPDATE Products SET product_name = ?, product_description = ?, price = ?, category_id = ? WHERE product_id = ?',
        [product_name, product_description, price, category_id, product_id]
      );
      return result; // Return the result of the update operation
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product by id
  deleteProduct: async (product_id) => {
    try {
      const [result] = await db.query('DELETE FROM Products WHERE product_id = ?', [product_id]);
      return result; // Return the result of the delete operation
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get recent products
  getRecentProducts: async () => {
    try {
      const [results] = await db.query('SELECT * FROM Products ORDER BY created_at DESC LIMIT 5');
      return results; // Return only the result set
    } catch (error) {
      console.error('Error fetching recent products:', error);
      throw error;
    }
  }
};

module.exports = ProductModel;
