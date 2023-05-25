'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product_Component.init({
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Product",
        key: 'id'
      }
    },
    component_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Component",
        key: 'id'
      }
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Product_Component',
  });

  Product_Component.removeAttribute("id")

  return Product_Component;
};