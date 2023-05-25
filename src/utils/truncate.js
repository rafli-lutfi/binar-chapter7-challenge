const {User, Supplier, Component, Product} = require("../db/models")

module.exports = {
  user: async () => {
    await User.destroy({truncate: true, restartIdentity: true})
  },
  supplier: async () => {
    await Supplier.destroy({truncate: true, cascade: true, restartIdentity: true})
  },
  component: async () => {
    await Component.destroy({truncate: true, cascade: true, restartIdentity: true})
  },
  product: async () => {
    await Product.destroy({truncate: true, cascade: true, restartIdentity: true})
  },
}