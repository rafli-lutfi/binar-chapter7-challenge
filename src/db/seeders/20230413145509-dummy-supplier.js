'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Suppliers', [{
      name: 'PT. DUNLOP INDONESIA',
      address: "Jakarta",
    },{
      name: 'PT. Cahaya Indah',
      address: "Bandung",
    },{
      name: 'PT. Yasindo Jaya Bersama',
      address: "Surabaya",
    },{
      name: 'PT. Michelin Indonesia',
      address: "Aceh",
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Suppliers', null, {});
  }
};
