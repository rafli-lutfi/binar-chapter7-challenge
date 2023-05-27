'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'Superadmin',
        description: 'can do anything and everything'
      },
      {
        name: 'Admin',
        description: 'have some privilage'
      },
      {
        name: 'User',
        description: 'just user'
      }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
