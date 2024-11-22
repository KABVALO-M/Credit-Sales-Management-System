const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/ProductCategoryModel'); // Add the Category Model

const productController = {
  // Render all products and categories
  renderProducts: async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        const [categories] = await CategoryModel.getAllCategories(); // Fetch categories
        res.render('products/products', { 
            user: req.session.user, 
            products: Array.isArray(products) ? products : [], // Ensure products is an array
            categories, // Pass categories to the view
            currentPage: 'products' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products and categories');
    }
},

 // Render the "Add Product" form
 renderAddProductForm: async (req, res) => {
  try {
    const [categories] = await CategoryModel.getAllCategories(); // Fetch categories for product form
    const recentProducts = await ProductModel.getRecentProducts(); // Fetch recent products
    res.render('products/addProduct', { 
      user: req.session.user, 
      categories, // Pass categories to the form for selection
      recentProducts, // Pass recent products for display
      currentPage: 'products' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching categories or recent products for product form');
  }
},

  // Add a new product
  addProduct: async (req, res) => {
    try {
      await ProductModel.addProduct(req.body);
      req.flash('success', 'Product added successfully');
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding product');
    }
  },

  // Render the "Edit Product" form
  renderEditProductForm: async (req, res) => {
    const product_id = req.params.id;
    try {
      const [product] = await ProductModel.getProductById(product_id);
      const [categories] = await CategoryModel.getAllCategories(); // Fetch categories for the form
      if (product) {
        res.render('products/editProduct', { 
          user: req.session.user, 
          product, 
          categories, // Pass categories for editing
          currentPage: 'products' 
        });
      } else {
        res.status(404).send('Product not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error rendering product edit form');
    }
  },

  // Update an existing product
  updateProduct: async (req, res) => {
    const product_id = req.params.id;
    try {
      await ProductModel.updateProduct(product_id, req.body);
      req.flash('success', 'Product updated successfully');
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating product');
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    const product_id = req.params.id;
    try {
      await ProductModel.deleteProduct(product_id);
      req.flash('success', 'Product deleted successfully');
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting product');
    }
  },

  // Category management methods
  renderAddCategoryForm: async (req, res) => {
    res.render('products/addCategory', { user: req.session.user, currentPage: 'products' });
  },

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

  deleteCategory: async (req, res) => {
    const category_id = req.params.id;
    try {
      await CategoryModel.deleteCategory(category_id);
      req.flash('success', 'Category deleted successfully');
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting category');
    }
  }
};

module.exports = productController;
