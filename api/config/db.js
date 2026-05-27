const Sequelize = require('sequelize');

const database = new Sequelize('facultades', 'root','',{
    host: 'localhost', 
    dialect: 'mysql',
    logging: false
});

module.exports = database;