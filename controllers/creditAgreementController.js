// controllers/creditAgreementController.js
const CreditAgreementModel = require('../models/CreditAgreementModel');
const CustomerModel = require('../models/CustomerModel');
const ProductModel = require('../models/ProductModel');

const creditAgreementController = {
  // Render all credit agreements
  renderAgreements: async (req, res) => {
    try {
      const agreements = await CreditAgreementModel.getAllAgreements();
      res.render('agreements/agreements', { user: req.session.user, agreements:agreements, currentPage: 'credit-agreements' });
    } catch (error) {
      res.status(500).send('Error fetching credit agreements');
    }
  },

  // Render the "Add Agreement" form
  renderAddAgreementForm: async (req, res) => {
    try {
      const customers = await CustomerModel.getAllCustomers();
      const products = await ProductModel.getAllProducts();
      const recentAgreements = await CreditAgreementModel.getRecentAgreements(); // Fetch recent agreements

      res.render('agreements/addAgreement', {
        user: req.session.user,
        customers,
        products,
        recentAgreements, // Pass recentAgreements to the view
        currentPage: 'credit-agreements'
      });
    } catch (error) {
      res.status(500).send('Error rendering Add Agreement form');
    }
  },

  // Add a new credit agreement
  addAgreement: async (req, res) => {
    const { 
      customer_id,
      employment_number, // This should not be here in the agreement data as it's not used directly
      customer_name, // This should not be here in the agreement data as it's not used directly
      customer_email, // This should not be here in the agreement data as it's not used directly
      product, // This should be product_id
      'price-per-unit': pricePerUnit, // This is not needed directly, total_amount should be used
      quantity, // This should not be here in the agreement data as it's not used directly
      total, // This should be total_amount
      start_date, 
      months: months_to_pay, // This should be renamed to months_to_pay
    } = req.body;

    // Convert total to a number
    const total_amount = parseFloat(total);
    
    // Compute monthly installment
    const monthly_installment = (total_amount / months_to_pay).toFixed(2); // To two decimal places

    // Set default status if not provided
    const agreementStatus = 'active'; // Default status set to 'active'

    const agreementData = {
      customer_id, // Ensure you fetch the customer ID before this point
      product_id: product, // Map the product to product_id
      quantity,
      total_amount,
      start_date,
      months_to_pay,
      monthly_installment,
      status: agreementStatus, // Use the default or provided status
    };

    try {
      // Ensure you fetch the customer ID before calling this function
      await CreditAgreementModel.addAgreement(agreementData);
      req.flash('success', 'Credit agreement added successfully');
      res.redirect('/agreements');
    } catch (error) {
      res.status(500).send('Error adding credit agreement');
    }
  },

  // Update an existing credit agreement
  updateAgreement: async (req, res) => {
    const agreement_id = req.params.id;
    const agreementData = req.body;
    try {
      await CreditAgreementModel.updateAgreement(agreement_id, agreementData);
      req.flash('success', 'Credit agreement updated successfully');
      res.redirect('/agreements');
    } catch (error) {
      res.status(500).send('Error updating credit agreement');
    }
  },

  // Delete a credit agreement
  deleteAgreement: async (req, res) => {
    const agreement_id = req.params.id;
    try {
      await CreditAgreementModel.deleteAgreement(agreement_id);
      req.flash('success', 'Credit agreement deleted successfully');
      res.redirect('/agreements');
    } catch (error) {
      res.status(500).send('Error deleting credit agreement');
    }
  },
};

module.exports = creditAgreementController;
