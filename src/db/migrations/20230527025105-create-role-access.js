'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoleAccesses', {
      role_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      module_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      is_read: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      is_write: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RoleAccesses');
  }
};