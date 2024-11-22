const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// Route to display all sales
router.get('/', isAuthenticated, salesController.renderSales);

// Route to display the "Add Sale" page
router.get('/add', isAuthenticated, salesController.renderAddSaleForm);

// Route to add a sale (POST)
router.post('/add', isAuthenticated, salesController.addSale);

// Route to update a sale (PUT or POST)
router.post('/update/:id', isAuthenticated, salesController.updateSale);

// Route to delete a sale (DELETE)
router.delete('/delete/:id', isAuthenticated, salesController.deleteSale);

module.exports = router;
