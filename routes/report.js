const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// Reports route - list of available reports
router.get('/', isAuthenticated, reportController.renderReportList);
router.get('/:id', isAuthenticated, reportController.renderReport);

module.exports = router;
