const db = require('../config/db'); // Assuming the same DB connection

const CategoryModel = {
  // Get all categories
  getAllCategories: () => {
    return db.query('SELECT * FROM ProductCategory');
  },

  // Get a category by its ID (optional if needed for editing)
  getCategoryById: (category_id) => {
    return db.query('SELECT * FROM ProductCategory WHERE category_id = ?', [category_id]);
  },

  // Add a new category
  addCategory: (categoryData) => {
    const { category_name } = categoryData;
    const sql = 'INSERT INTO ProductCategory (category_name) VALUES (?)';
    return db.query(sql, [category_name]);
  },

  // Delete a category by its ID
  deleteCategory: (category_id) => {
    return db.query('DELETE FROM ProductCategory WHERE category_id = ?', [category_id]);
  }
};

module.exports = CategoryModel;
