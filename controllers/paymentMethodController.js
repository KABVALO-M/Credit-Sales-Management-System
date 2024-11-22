const PaymentMethodModel = require('../models/paymentMethodModel');

module.exports = {
  // Render all payment methods
  renderPaymentMethods: async (req, res) => {
    try {
      const paymentMethods = await PaymentMethodModel.getAllPaymentMethods();
      res.render('paymentMethods/paymentMethods', { paymentMethods, user: req.session.user });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).send('Error fetching payment methods');
    }
  },

  // Render the "Add Payment Method" form
  renderAddPaymentMethodForm: (req, res) => {
    res.render('paymentMethods/add', { user: req.session.user });
  },

  // Add a new payment method
  addPaymentMethod: async (req, res) => {
    const { method_name } = req.body;
    try {
      await PaymentMethodModel.addPaymentMethod({ method_name });
      req.flash('success', 'Payment method added successfully');
      res.redirect('/payments');
    } catch (error) {
      console.error('Error adding payment method:', error);
      res.status(500).send('Error adding payment method');
    }
  },

  // Update a payment method
  updatePaymentMethod: async (req, res) => {
    const { id } = req.params;
    const { method_name } = req.body;
    try {
      await PaymentMethodModel.updatePaymentMethod(id, { method_name });
      req.flash('success', 'Payment method updated successfully');
      res.redirect('/payment-methods');
    } catch (error) {
      console.error('Error updating payment method:', error);
      res.status(500).send('Error updating payment method');
    }
  },

  // Delete a payment method
  deletePaymentMethod: async (req, res) => {
    const { id } = req.params;
    try {
      await PaymentMethodModel.deletePaymentMethod(id);
      req.flash('success', 'Payment method deleted successfully');
      res.redirect('/payment-methods');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).send('Error deleting payment method');
    }
  }
};
