// controllers/customerController.js
const CustomerModel = require('../models/CustomerModel');

const customerController = {
  // Render all customers
  renderCustomers: async (req, res) => {
    try {
      const customers = await CustomerModel.getAllCustomers();
      res.render('customers/customers', {user: req.session.user, customers, currentPage: 'customers', });
    } catch (error) {
      res.status(500).send('Error fetching customers');
    }
  },

  // Render the "Add Customer" form and show 5 previously added customers
  renderAddCustomerForm: async (req, res) => {
    try {
      // Fetch only the first and last names of the latest 5 customers
      const recentCustomers = await CustomerModel.getLatestCustomers(5);
      res.render('customers/addCustomer', { user: req.session.user, recentCustomers, currentPage: 'customers' });
    } catch (error) {
      res.status(500).send('Error rendering Add Customer form');
    }
  },   

  // Add a new customer
  addCustomer: async (req, res) => {
    const customerData = req.body;
    try {
      await CustomerModel.addCustomer(customerData);
      req.flash('success', 'Customer added successfully');
      res.redirect('/customers');
    } catch (error) {
      res.status(500).send('Error adding customer');
    }
  },

  // Update an existing customer
  updateCustomer: async (req, res) => {
    const customer_id = req.params.id;
    const customerData = req.body;
    try {
      await CustomerModel.updateCustomer(customer_id, customerData);
      req.flash('success', 'Customer updated successfully');
      res.redirect('/customers');
    } catch (error) {
      res.status(500).send('Error updating customer');
    }
  },

  // Delete a customer
  deleteCustomer: async (req, res) => {
    const customer_id = req.params.id;
    try {
      await CustomerModel.deleteCustomer(customer_id);
      req.flash('success', 'Customer deleted successfully');
      res.redirect('/customers');
    } catch (error) {
      res.status(500).send('Error deleting customer');
    }
  },

  // Get customer details by employment number (the new method)
  getCustomerDetails: async (req, res) => {
    const employmentNumber = req.params.employmentNumber;
    try {
      const customer = await CustomerModel.findByEmploymentNumber(employmentNumber);
      if (customer) {
        res.json({
          success: true,
          customer: {
            id: customer.customer_id,
            name: customer.name,
            email: customer.email,
          }
        });
      } else {
        res.json({ success: false, message: 'Customer not found' });
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
  }
};

module.exports = customerController;
