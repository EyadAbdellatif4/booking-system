'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'johndoe',
        email: 'john.doe@example.com',
        password_hash: hashedPassword,
        created_at: new Date()
      },
      {
        username: 'janedoe',
        email: 'jane.doe@example.com',
        password_hash: hashedPassword,
        created_at: new Date()
      },
      {
        username: 'booklover',
        email: 'booklover@example.com',
        password_hash: hashedPassword,
        created_at: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};

