'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'superadmin',
        email: "superadmin@email.com",
        password: "superadmin",
        user_type: "basic",
        role_id: 1
      },
      {
        username: 'admin',
        email: "admin@email.com",
        password: "admin",
        user_type: "basic",
        role_id: 2
      },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
