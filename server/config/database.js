const { Sequelize } = require("sequelize"); 
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

const auth = async () => { 
    try {
        await sequelize.authenticate(); 
        console.log('✅ Se conectó satisfactoriamente a la base de datos.');
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
    }
};

auth(); 

module.exports = sequelize;
