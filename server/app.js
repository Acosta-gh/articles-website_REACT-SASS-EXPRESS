const express = require('express');
const router = require('./routes');
const sequelize = require('./config/database');

require('dotenv').config();

const app = express();

var cors = require('cors')
app.use(cors());



app.use(express.json());
app.use("/api", router);


const port = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }

    try {
        await sequelize.sync({ alter: true });
        console.log('Models have been synchronized and tables have been updated.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})();