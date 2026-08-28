const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transaction = sequelize.define('Transaction', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    type:{
        type:DataTypes.STRING(20),
        allowNull: false,
        validate:{
            isIn:[['income','expense']]
        },
        },
    amount:{
        type:DataTypes.DECIMAL(12,2),
        allowNull: false,
        validate:{
            min:0.01
            },
        },
    description:{
        type:DataTypes.STRING(100),
        allowNull:true,
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
     }, 
    }, {
  tableName: 'Transactions',
  timestamps: true,
});

module.exports = Transaction;