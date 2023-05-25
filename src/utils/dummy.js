const { Component } = require("../db/models");

module.exports = {
  component: async () => {
    await Component.bulkCreate([
      {
        name: "ban",
        description: "ban terkuat se Indonesia",
      },
      {
        name: "stang",
        description: "stang motor terbaik",
      },
      {
        name: "setir",
        description: "setir mobil berkualitas",
      },
      {
        name: "kaca",
        description: "laminated 0,76 milimeter",
      },
    ]);
  },
};
