const CategoryModel = require('../models/ProductCategoryModel');

const categoryController = {
  // Add a new category
  addCategory: async (req, res) => {
    try {
      await CategoryModel.addCategory(req.body);
      req.flash('success', 'Category added successfully');
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding category');
    }
  },

  // Render the "Edit Category" form
  renderEditCategoryForm: async (req, res) => {
    const category_id = req.params.id;
    try {
      const [category] = await CategoryModel.getCategoryById(category_id);
      if (category) {
        res.render('categories/editCategory', { 
          user: req.session.user, 
          category, 
          currentPage: 'categories' 
        });
      } else {
        res.status(404).send('Category not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error rendering edit category form');
    }
  },

  // Update an existing category
  updateCategory: async (req, res) => {
    const category_id = req.params.id;
    try {
      await CategoryModel.updateCategory(category_id, req.body);
      req.flash('success', 'Category updated successfully');
      res.redirect('/categories');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating category');
    }
  },

  // Delete a category
  deleteCategory: async (req, res) => {
    const category_id = req.params.id;
    try {
      await CategoryModel.deleteCategory(category_id);
      req.flash('success', 'Category deleted successfully');
      res.redirect('/categories');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting category');
    }
  }
};

module.exports = categoryController;
