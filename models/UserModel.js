// models/UserModel.js
const db = require('../config/db');

const UserModel = {
  // Function to find a user by their username
  findByUsername: async (username) => {
    try {
      const [user] = await db.query('SELECT * FROM User WHERE username = ?', [username]);
      return user.length > 0 ? user[0] : null; // Return the user object if found, else null
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserModel;
