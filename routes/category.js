const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

router.post('/add', isAuthenticated, categoryController.addCategory); // Add new category
router.get('/edit/:id', isAuthenticated, categoryController.renderEditCategoryForm); // Display edit category form
router.post('/edit/:id', isAuthenticated, categoryController.updateCategory); // Update category
router.post('/delete/:id', isAuthenticated, categoryController.deleteCategory); // Delete category

module.exports = router;
