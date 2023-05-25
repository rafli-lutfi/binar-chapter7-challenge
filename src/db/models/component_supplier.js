'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Component_Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Component_Supplier.init({
    component_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Component",
        key: 'id'
      }
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Supplier",
        key: 'id'
      }
    }
  }, {
    sequelize,
    timestamps: false,   
    modelName: 'Component_Supplier',
  });

  Component_Supplier.removeAttribute("id");

  return Component_Supplier;
};