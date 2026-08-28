const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
     name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  passwordHash:{
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  preferredCurrency:{
    type: DataTypes.CHAR(3),
    allowNull: false,
    defaultValue: "PKR",
  },
    }, {
  tableName: 'Users',
  timestamps: true,
});

module.exports = User;