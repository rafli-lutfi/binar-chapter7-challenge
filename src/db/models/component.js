'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Component.belongsToMany(models.Supplier, {as:"suppliers", foreignKey:"component_id", through: models.Component_Supplier}),
      Component.belongsToMany(models.Product, {as: "products", foreignKey:"component_id", through: models.Product_Component})
    }
  }
  Component.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Component',
  });
  return Component;
};