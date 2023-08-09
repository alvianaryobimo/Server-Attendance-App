'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Attendance)
      Users.belongsTo(models.Role)
    }
  }
  Users.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    imgProfile: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};