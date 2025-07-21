const { Sequelize } = require("sequelize"); 
require('dotenv').config();
const path = require('path');

// Configuración de Sequelize para SQLite
const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    storage: path.join(__dirname, '..', `${process.env.DB_NAME || 'blog'}.sqlite`), // Ruta al archivo de la base de datos SQLite
    logging: console.log 
});

// Función para autenticar la conexión a la base de datos
const auth = async () => { 
    try {
        await sequelize.authenticate(); 
        const dbPath = path.join(__dirname, '..', `${process.env.DB_NAME || 'blog'}.sqlite`);
        console.log('✅ Se conectó satisfactoriamente a la base de datos.');
        console.log(`📂 Ubicación de la base de datos SQLite: ${dbPath}`);
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
    }
};

auth(); 

module.exports = sequelize;   