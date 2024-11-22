// models/customerModel.js
const db = require('../config/db');

const CustomerModel = {
  // Function to get all customers
  getAllCustomers: async () => {
    try {
      const [customers] = await db.query('SELECT * FROM customers');
      return customers;
    } catch (error) {
      throw error;
    }
  },

  // Function to get only the latest 5 customers
  getLatestCustomers: async (limit) => {
    try {
      const [customers] = await db.query('SELECT first_name, last_name FROM customers ORDER BY customer_id DESC LIMIT ?', [limit]);
      return customers;
    } catch (error) {
      throw error;
    }
  },


  // Function to add a new customer
  addCustomer: async (customerData) => {
    const {
      first_name,
      last_name,
      employment_number,
      phone_number,
      email,
      date_of_birth,
      employment_position,
      department,
      work_address,
      residential_address,
      city,
      state,
      postal_code,
    } = customerData;

    try {
      const result = await db.query(
        `INSERT INTO customers 
        (first_name, last_name, employment_number, phone_number, email, date_of_birth, employment_position, department, work_address, residential_address, city, state, postal_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,
          last_name,
          employment_number,
          phone_number,
          email,
          date_of_birth,
          employment_position,
          department,
          work_address,
          residential_address,
          city,
          state,
          postal_code,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Function to update a customer
  updateCustomer: async (customer_id, customerData) => {
    const {
      first_name,
      last_name,
      employment_number,
      phone_number,
      email,
      date_of_birth,
      employment_position,
      department,
      work_address,
      residential_address,
      city,
      state,
      postal_code,
    } = customerData;

    try {
      const result = await db.query(
        `UPDATE customers 
        SET first_name = ?, last_name = ?, employment_number = ?, phone_number = ?, email = ?, date_of_birth = ?, employment_position = ?, department = ?, work_address = ?, residential_address = ?, city = ?, state = ?, postal_code = ?
        WHERE customer_id = ?`,
        [
          first_name,
          last_name,
          employment_number,
          phone_number,
          email,
          date_of_birth,
          employment_position,
          department,
          work_address,
          residential_address,
          city,
          state,
          postal_code,
          customer_id,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Function to delete a customer
  deleteCustomer: async (customer_id) => {
    try {
      const result = await db.query('DELETE FROM customers WHERE customer_id = ?', [customer_id]);
      return result;
    } catch (error) {
      throw error;
    }
  },

   // Find a customer by employment number
   findByEmploymentNumber: async (employmentNumber) => {
    try {
      const [results] = await db.query(
        'SELECT CONCAT(first_name, " ", last_name) AS name, email, customer_id FROM customers WHERE employment_number = ?',
        [employmentNumber]
      );
      if (results.length > 0) {
        return results[0]; // Return the customer object if found
      }
      return null; // No customer found
    } catch (error) {
      console.error('Error fetching customer by employment number:', error);
      throw error;
    }
  }
};

module.exports = CustomerModel;
