'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('genres', [
      { name: 'Horror' },
      { name: 'Comedy' },
      { name: 'Drama' },
      { name: 'Science Fiction' },
      { name: 'Fantasy' },
      { name: 'Mystery' },
      { name: 'Romance' },
      { name: 'Thriller' },
      { name: 'Historical Fiction' },
      { name: 'Biography' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('genres', null, {});
  }
};

