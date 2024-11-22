const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/isAuthenticated');
const  authContoller  = require('../controllers/authController');

router.get('/', isAuthenticated, authContoller.renderDashboard);

module.exports = router;
