'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.Component, {as:"components", foreignKey:"product_id", through: models.Product_Component})
    }
  }
  Product.init({
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Product',
  });
  return Product;
};