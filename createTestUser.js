const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Database connection setup
const dbConfig = {
  host: 'localhost',  // Change if necessary
  user: 'root',       // Change to your MySQL username
  password: '',       // Change to your MySQL password
  database: 'credit_sales_management_system'  // Change to your database
};

async function createTestUser() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Test user details
    const username = 'testuser';
    const password = 'password123';  // Plain password
    const role = 'Admin';
    const email = 'testuser@example.com';

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // SQL query to insert user
    const sql = `INSERT INTO User (username, password_hash, role, email) VALUES (?, ?, ?, ?)`;
    const values = [username, passwordHash, role, email];

    // Execute the query
    await connection.execute(sql, values);
    console.log('Test user created successfully!');

    // Close the connection
    await connection.end();
  } catch (err) {
    console.error('Error creating test user:', err);
  }
}

createTestUser();
