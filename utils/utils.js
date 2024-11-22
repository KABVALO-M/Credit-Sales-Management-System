// In a utility file, e.g., utils.js
function formatCurrency(amount) {
    if (isNaN(amount)) return '0.00'; // Handle non-numeric values
    // Round to 2 decimal places
    const roundedAmount = Math.round(parseFloat(amount) * 100) / 100;
    return roundedAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format with commas
}

module.exports = { formatCurrency };
