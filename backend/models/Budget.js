const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Budget = sequelize.define('Budget', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    categoryId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    amount:{
        type:DataTypes.DECIMAL(12,2),
        allowNull: false,
        validate:{
            min:0.01
        }
    },
    period:{
        type:DataTypes.CHAR(7),
        allowNull: false,
    },
    }, {
  tableName: 'Budgets',
  timestamps: true,
});

module.exports = Budget;