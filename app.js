const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();
const { formatCurrency } = require('./utils/utils');

const app = express();

app.locals.formatCurrency = formatCurrency;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Flash messages
app.use(flash());

// Flash middleware for displaying messages
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success') || [];
  res.locals.errorMessage = req.flash('error') || [];
  next();
});

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customer');
const salesRoutes = require('./routes/sales');
const categoryRoutes = require('./routes/category');
const agreementRoutes = require('./routes/creditAgreement');
const paymentRoutes = require('./routes/payment');
const paymentMethodRoutes = require('./routes/paymentMethod');
const reportRoutes = require('./routes/report');

// Use routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/sales', salesRoutes);
app.use('/categories', categoryRoutes);
app.use('/agreements', agreementRoutes);
app.use('/payments', paymentRoutes);
app.use('/paymentMethods', paymentMethodRoutes);
app.use('/reports', reportRoutes);

// 404 Error handler
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page Not Found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
