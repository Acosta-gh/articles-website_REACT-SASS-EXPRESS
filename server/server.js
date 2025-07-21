require("dotenv").config();

const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");
const { sequelize } = require("./models"); 

const User = require("./models/user.model");

// Función para inicializar el servidor
async function initializeServer() {
    try {
        // Primero, sincroniza la base de datos para asegurar que las tablas existan
        console.log("ℹ️  Sincronizando la base de datos...");
        
        // Corrección: directamente await a sequelize.sync()
        try {
            await sequelize.sync({ force: false });
            console.log("✅ Modelos sincronizados correctamente.");
        } catch (error) {
            console.error("❌ Error al sincronizar los modelos:", error);
            throw error; // Re-lanzar el error para que lo capture el try/catch externo
        }
        
        console.log("✅ Base de datos sincronizada exitosamente");

        // Ahora verifica si existe el usuario administrador
        const adminExists = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });

        // Crea el usuario administrador si no existe
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            console.log("ℹ️  Creando usuario administrador...");
            await User.create({
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL, 
                password: hashedPassword,
                isAdmin: 1,
            });
            console.log("✅ Usuario administrador creado exitosamente");
        } else {
            console.log("⚠️  El usuario administrador ya existe, no se creará uno nuevo.");
        }

        // Configura los middlewares
        app.use("/uploads", express.static("uploads"));
        app.use(cors());
        app.use(express.json());
        app.use(routes);

        // Inicia el servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`✅ Servidor ejecutándose en el puerto ${PORT}.`));
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
        console.error(error.stack); // Muestra la pila de errores para depuración
        process.exit(1);
    }
}

// Soluciona la advertencia de fuga de memoria de EventEmitter
require('events').EventEmitter.defaultMaxListeners = 15;

// Ejecuta el servidor
initializeServer();