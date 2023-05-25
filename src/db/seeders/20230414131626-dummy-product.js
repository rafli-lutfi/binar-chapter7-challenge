'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [{
      name: 'Honda CBR',
      quantity: 200
    },{
      name: 'Honda HRV',
      quantity: 25
    },{
      name: 'ATV Honda Sport TRX90X',
      quantity: 50
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
