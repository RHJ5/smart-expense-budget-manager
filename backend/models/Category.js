const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = sequelize.define('Category', {
id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true,
},
name:{
    type: DataTypes.STRING(100),
    allowNull: false,
},
type:{
    type:DataTypes.STRING(20),
    allowNull: false,
    validate:{
        isIn:[['income','expense']],
    },
},
isDefault:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
},
userId:{
    type:DataTypes.INTEGER,
    allowNull: true,
},

}, {
    tableName: 'Categories',
    timestamps: true,
});
module.exports = Category;