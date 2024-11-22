const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// Route to display all payment methods
router.get('/', isAuthenticated, paymentMethodController.renderPaymentMethods);

// Route to display the "Add Payment Method" page
router.get('/add', isAuthenticated, paymentMethodController.renderAddPaymentMethodForm);

// Route to add a payment method (POST)
router.post('/add', isAuthenticated, paymentMethodController.addPaymentMethod);

// Route to update a payment method (PUT or POST)
router.post('/update/:id', isAuthenticated, paymentMethodController.updatePaymentMethod);

// Route to delete a payment method (DELETE)
router.delete('/delete/:id', isAuthenticated, paymentMethodController.deletePaymentMethod);

module.exports = router;
