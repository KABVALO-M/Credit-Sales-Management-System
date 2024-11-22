const reportModel = require('../models/reportModel'); // Import the reportModel

module.exports = {
    // Render the report list (only showing Monthly Receivables for now)
    renderReportList: (req, res) => {
        const reports = [
            { id: 1, name: 'Monthly Receivables' }
        ];

        // Set the current page as the report list
        const currentPage = 'reports';

        res.render('reports/reportList', { reports, user: req.session.user, currentPage });
    },

    // Controller to render a specific report based on its id
    renderReport: async (req, res) => {
        const reportId = req.params.id;

        try {
            // Check for report ID
            if (reportId == 1) {
                // Fetch the "Monthly Receivables" data from the model (unpaid agreements)
                const result = await reportModel.getUnpaidAgreements();

                // Render the result view for "Monthly Receivables"
                return res.render('reports/monthlyReceivables', {
                    title: 'Monthly Receivables',
                    receivables: result,          // Pass the report data to the view
                    user: req.session.user,       // Pass user info from session
                    currentPage: 'reports'        // Set the current page as 'reports'
                });
            } else {
                // If the report ID is not recognized, show a 404 error
                return res.status(404).send('Report not found.');
            }
        } catch (err) {
            // Handle errors
            console.error('Error generating report:', err);
            return res.status(500).send('Server error.');
        }
    }
};
