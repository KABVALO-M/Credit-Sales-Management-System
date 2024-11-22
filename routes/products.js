const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated } = require('../middleware/isAuthenticated');


// Products route
router.get('/', isAuthenticated, productController.renderProducts);
router.get('/add', isAuthenticated, productController.renderAddProductForm);
router.post('/add', isAuthenticated, productController.addProduct);

module.exports = router;
