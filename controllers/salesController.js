// controllers/salesController.js
const SalesModel = require('../models/SalesModel');
const ProductModel = require('../models/ProductModel');
const CustomerModel = require('../models/CustomerModel');

const salesController = {
  // Render all sales
  renderSales: async (req, res) => {
    try {
      const sales = await SalesModel.getAllSales();
      res.render('sales/sales', { user: req.session.user, sales, currentPage: 'sales' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching sales');
    }
  },

  // Render the "Add Sale" form
  renderAddSaleForm: async (req, res) => {
    try {
      // Fetch all required data
      const products = await ProductModel.getAllProducts();
      const customers = await CustomerModel.getAllCustomers();
      const agreementsWithoutSales = await SalesModel.getAgreementsWithoutSales();

      // Render the view with the fetched data
      res.render('sales/addSale', {
        user: req.session.user,
        products,             // Pass the list of products to the view
        customers,            // Pass the list of customers to the view
        agreementsWithoutSales, // Pass agreements without sales to the view
        currentPage: 'sales'  // Specify the current page as 'sales'
      });
    } catch (error) {
      // Handle any errors
      console.error('Error rendering Add Sale form:', error);
      res.status(500).send('Error rendering Add Sale form');
    }
  },


  // Add a new sale
  addSale: async (req, res) => {
    const { employment_number, first_name, last_name, agreement_id, credit_agreement, agreement_total, monthly_installments, total_months, product_name, quantity, unit_price, total_price } = req.body;
    const saleData = {
      agreement_id,
      agreement_total
    }

    console.log(saleData)
    
    try {
      await SalesModel.addSale(saleData);
      req.flash('success', 'Sale added successfully');
      res.redirect('/sales');
    } catch (error) {
      res.status(500).send('Error adding sale');
    }
  },

  // Update an existing sale
  updateSale: async (req, res) => {
    const sale_id = req.params.id;
    const saleData = req.body;

    try {
      await SalesModel.updateSale(sale_id, saleData);
      req.flash('success', 'Sale updated successfully');
      res.redirect('/sales');
    } catch (error) {
      res.status(500).send('Error updating sale');
    }
  },

  // Delete a sale
  deleteSale: async (req, res) => {
    const sale_id = req.params.id;

    try {
      await SalesModel.deleteSale(sale_id);
      req.flash('success', 'Sale deleted successfully');
      res.redirect('/sales');
    } catch (error) {
      res.status(500).send('Error deleting sale');
    }
  }
};

module.exports = salesController;
