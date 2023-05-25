'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Supplier.belongsToMany(models.Component, {as:"components", foreignKey:"supplier_id", through:models.Component_Supplier})
    }
  }
  Supplier.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    timestamps:false,
    modelName: 'Supplier',
  });
  return Supplier;
};