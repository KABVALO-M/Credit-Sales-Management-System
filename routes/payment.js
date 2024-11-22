const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// Route to display all payments
router.get('/', isAuthenticated, paymentController.renderPayments);

// Route to display the "Add Payment" page
router.get('/add', isAuthenticated, paymentController.renderAddPaymentForm);

// Route to add a payment (POST)
router.post('/add', isAuthenticated, paymentController.addPayment);

// Route to update a payment (PUT or POST)
router.post('/update/:id', isAuthenticated, paymentController.updatePayment);

// Route to delete a payment (DELETE)
router.delete('/delete/:id', isAuthenticated, paymentController.deletePayment);

module.exports = router;
