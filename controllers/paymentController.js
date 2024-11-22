const PaymentModel = require('../models/paymentModel');
const CreditAgreementModel = require('../models/creditAgreementModel'); // Assuming this handles agreements
const PaymentMethodModel = require('../models/paymentMethodModel');

module.exports = {
  // Render all payments
  renderPayments: async (req, res) => {
    try {
      const payments = await PaymentModel.getAllPayments();
      const paymentMethods = await PaymentMethodModel.getAllPaymentMethods(); 
      
      res.render('payments/payments', {
        payments,
        paymentMethods,
        currentPage: 'payments',
        user: req.session.user,
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      req.flash('error', 'Could not fetch payment data.');
      res.redirect('/');
    }
  },

  // Render the "Add Payment" form
    renderAddPaymentForm: async (req, res) => {
        try {
        const paymentMethods = await PaymentModel.getPaymentMethods(); // Fetch payment methods
        const outstandingPayments = await PaymentModel.getOutstandingPayments(); // Fetch outstanding sales
    
        res.render('payments/addPayment', {
            paymentMethods, // Pass payment methods to the view
            outstandingPayments, // Pass outstanding sales to the view
            user: req.session.user,
            currentPage: 'payment' // or any page identifier you want
        });
        } catch (error) {
        console.error('Error fetching payment methods or outstanding sales:', error);
        res.status(500).send('Error loading the add payment form');
        }
    },

  // Add a new payment
  addPayment: async (req, res) => {
    const { agreement_id, payment_amount, payment_method } = req.body;
    const paymentData = {
      agreement_id,
      amount_paid: parseFloat(payment_amount),
      payment_date: new Date(), // current date
      payment_method
    };
    try {
      await PaymentModel.addPayment(paymentData);
      req.flash('success', 'Payment added successfully');
      res.redirect('/payments');
    } catch (error) {
      console.error('Error adding payment:', error);
      res.status(500).send('Error adding payment');
    }
  },

  // Update a payment
  updatePayment: async (req, res) => {
    const { id } = req.params;
    const { amount_paid, payment_method_id } = req.body;
    try {
      await PaymentModel.updatePayment(id, { amount_paid: parseFloat(amount_paid), payment_method_id });
      req.flash('success', 'Payment updated successfully');
      res.redirect('/payments');
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).send('Error updating payment');
    }
  },

  // Delete a payment
  deletePayment: async (req, res) => {
    const { id } = req.params;
    try {
      await PaymentModel.deletePayment(id);
      req.flash('success', 'Payment deleted successfully');
      res.redirect('/payments');
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).send('Error deleting payment');
    }
  }
};
