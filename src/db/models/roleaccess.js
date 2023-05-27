'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RoleAccess.init({
    role_id: DataTypes.INTEGER,
    module_id: DataTypes.INTEGER,
    is_read: DataTypes.BOOLEAN,
    is_write: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RoleAccess',
    timestamps: false
  });

  RoleAccess.removeAttribute("id")
  
  return RoleAccess;
};