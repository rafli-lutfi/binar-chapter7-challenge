'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert("Components", [{
      name: "ban",
      description: "ban terkuat se Indonesia",
    },{
      name: "stang",
      description: "stang motor terbaik",
    },{
      name: "setir",
      description: "setir mobil berkualitas",
    },{
      name: "kaca",
      description: "laminated 0,76 milimeter",
    },{
      name: "sunroof",
      description: "automatic incline sunroof",
    },{
      name: "bumper",
      description: "tahan banting",
    },{
      name: "seat",
      description: "seat terbaik",
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Components', null, {});
  }
};
