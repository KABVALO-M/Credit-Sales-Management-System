const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const DashboardModel = require('../models/DashboardModel');


// Render the dashboard
exports.renderDashboard = async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in first');
    return res.redirect('/auth/login');
  }

  try {
    // Fetch data using DashboardModel
    const customers = await DashboardModel.getTotalCustomers();
    const sales = await DashboardModel.getTotalSales();
    const products = await DashboardModel.getTotalProducts();
    // const stock = await DashboardModel.getTotalStock();
    const payments = await DashboardModel.getTotalPayments();
    const recentSales = await DashboardModel.getRecentSales();

    // Calculate growth using DashboardModel
    const customerGrowth = await DashboardModel.calculateCustomerGrowth();
    const salesGrowth = await DashboardModel.calculateSalesGrowth();
    // const stockGrowth = await DashboardModel.calculateStockGrowth();
    const productGrowth = await DashboardModel.calculateProductGrowth();
    const paymentsGrowth = await DashboardModel.calculatePaymentsGrowth();

    // Render the dashboard view, passing the fetched data
    res.render('dashboard', {
      user: req.session.user,
      currentPage: 'dashboard',
      customers,
      sales,
      products,
      // stock,
      payments,
      customerGrowth,
      salesGrowth,
      // stockGrowth,
      productGrowth,
      paymentsGrowth,
      recentSales
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).send('Server Error');
  }
};

// Render login page
exports.getLoginPage = (req, res) => {
  // Render the login page with flash messages
  res.render('auth/login');
};


// Login logic
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user by username using UserModel
    const user = await UserModel.findByUsername(username);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (passwordMatch) {
        // Store user session
        req.session.user = {
          id: user.user_id,
          username: user.username,
          role: user.role,
        };

        req.flash('success', 'Logged in successfully');
        return res.redirect('/');
      } else {
        req.flash('error', 'Invalid username or password');
        return res.redirect('/auth/login');
      }
    } else {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server Error');
  }
};


// Logout logic
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Server Error');
    }
    res.redirect('/auth/login');
  });
};