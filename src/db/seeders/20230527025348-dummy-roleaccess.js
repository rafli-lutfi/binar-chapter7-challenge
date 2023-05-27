'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoleAccesses', [
      {
        role_id: 1,
        module_id: 1,
        is_read: true,
        is_write: true
      },
      {
        role_id: 1,
        module_id: 2,
        is_read: true,
        is_write: true
      },
      {
        role_id: 2,
        module_id: 1,
        is_read: true,
        is_write: false
      },
      {
        role_id: 2,
        module_id: 2,
        is_read: true,
        is_write: true
      },
      {
        role_id: 3,
        module_id: 1,
        is_read: false,
        is_write: false
      },
      {
        role_id: 3,
        module_id: 2,
        is_read: true,
        is_write: false
      },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoleAccesses', null, {});
  }
};
