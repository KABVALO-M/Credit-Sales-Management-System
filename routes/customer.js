// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { isAuthenticated } = require('../middleware/isAuthenticated');


// Route to display all customers
router.get('/', isAuthenticated, customerController.renderCustomers);

// Route to render the Add Customer form (GET)
router.get('/add', isAuthenticated, customerController.renderAddCustomerForm);

// Route to add a customer
router.post('/add', isAuthenticated, customerController.addCustomer);

// Route to update a customer
router.post('/update/:id', isAuthenticated, customerController.updateCustomer);

// Route to delete a customer
router.post('/delete/:id', isAuthenticated, customerController.deleteCustomer);

router.get('/details/:employmentNumber', isAuthenticated, customerController.getCustomerDetails);

module.exports = router;
