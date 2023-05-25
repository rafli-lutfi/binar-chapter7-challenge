'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Component_Suppliers', {
      component_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references:{
          model: "Components",
          key: "id",
          as: "component_id"
        }
      },
      supplier_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references:{
          model: "Suppliers",
          key: "id",
          as: "supplier_id"
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Component_Suppliers');
  }
};