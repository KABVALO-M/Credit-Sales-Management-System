// routes/creditAgreementRoutes.js
const express = require('express');
const router = express.Router();
const creditAgreementController = require('../controllers/creditAgreementController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// Route to display all credit agreements
router.get('/', isAuthenticated, creditAgreementController.renderAgreements);

// Route to render the Add Agreement form (GET)
router.get('/add', isAuthenticated, creditAgreementController.renderAddAgreementForm);

// Route to add a credit agreement
router.post('/add', isAuthenticated, creditAgreementController.addAgreement);

// Route to update a credit agreement
router.post('/update/:id', isAuthenticated, creditAgreementController.updateAgreement);

// Route to delete a credit agreement
router.post('/delete/:id', isAuthenticated, creditAgreementController.deleteAgreement);

module.exports = router;
