require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      options: {
        encrypt: false, // set true if using Azure SQL later
        trustServerCertificate: true, // needed for local dev without a real SSL cert
      },
    },
    logging: console.log, // shows generated SQL in terminal — helpful while learning, we'll turn this off later
  }
);

module.exports = sequelize;