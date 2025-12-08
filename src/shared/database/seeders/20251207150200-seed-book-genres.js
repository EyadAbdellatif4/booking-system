'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Assuming genres are seeded in order: Horror=1, Comedy=2, Drama=3, Science Fiction=4, Fantasy=5, Mystery=6, Romance=7, Thriller=8, Historical Fiction=9, Biography=10
    // And books: The Great Gatsby=1, 1984=2, To Kill a Mockingbird=3, Pride and Prejudice=4, The Catcher in the Rye=5, Lord of the Flies=6, The Hobbit=7, Fahrenheit 451=8
    
    await queryInterface.bulkInsert('book_genres', [
      // The Great Gatsby - Drama, Historical Fiction
      { book_id: 1, genre_id: 3 },
      { book_id: 1, genre_id: 9 },
      
      // 1984 - Science Fiction, Thriller
      { book_id: 2, genre_id: 4 },
      { book_id: 2, genre_id: 8 },
      
      // To Kill a Mockingbird - Drama, Historical Fiction
      { book_id: 3, genre_id: 3 },
      { book_id: 3, genre_id: 9 },
      
      // Pride and Prejudice - Romance, Drama
      { book_id: 4, genre_id: 7 },
      { book_id: 4, genre_id: 3 },
      
      // The Catcher in the Rye - Drama
      { book_id: 5, genre_id: 3 },
      
      // Lord of the Flies - Thriller, Drama
      { book_id: 6, genre_id: 8 },
      { book_id: 6, genre_id: 3 },
      
      // The Hobbit - Fantasy
      { book_id: 7, genre_id: 5 },
      
      // Fahrenheit 451 - Science Fiction, Thriller
      { book_id: 8, genre_id: 4 },
      { book_id: 8, genre_id: 8 },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('book_genres', null, {});
  }
};

