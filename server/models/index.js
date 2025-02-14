const sequelize = require("../config/database");

const Post = require("./post.model"); 
const Category = require("./category.model");
const User = require("./user.model");

const syncDb = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("✅ Los modelos se sincronizaron satisfactoriamente.");
    } catch (err) {
        console.log("❌ Hubo un error al sincronizar los modelos: ", err);
    }
};

syncDb();

module.exports = { Post, Category, User};
