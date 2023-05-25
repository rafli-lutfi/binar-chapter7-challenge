'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Product_Components', [{
        product_id: 1,
        component_id: 1
      },{
        product_id: 1,
        component_id: 2
      },{
        product_id: 1,
        component_id: 7
      },{
        product_id: 2,
        component_id: 1
      },{
        product_id: 2,
        component_id: 3
      },{
        product_id: 2,
        component_id: 4
      },{
        product_id: 2,
        component_id: 5
      },{
        product_id: 2,
        component_id: 6
      },{
        product_id: 2,
        component_id: 7
      },{
        product_id: 3,
        component_id: 1
      },{
        product_id: 3,
        component_id: 2
      },{
        product_id: 3,
        component_id: 6
      },{
        product_id: 3,
        component_id: 7
      }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Product_Components', null, {});
  }
};
