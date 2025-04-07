const sequelize = require("../config/database");

const Post = require("./post.model"); 
const Category = require("./category.model");
const User = require("./user.model");
const Bookmark = require("./bookmark.model");

// Relaciones 
Post.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Post, { foreignKey: 'categoryId' });

Post.belongsTo(User, { foreignKey: 'author', as: 'authorUser' });
User.hasMany(Post, { foreignKey: 'author' });

// Relaciones muchos a muchos
User.belongsToMany(Post, {
  through: Bookmark,
  foreignKey: 'userId',
  as: 'savedPosts',
});
Post.belongsToMany(User, {
  through: Bookmark,
  foreignKey: 'postId',
  as: 'savedByUsers',
});

// Sincronización
const syncDb = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("✅ Los modelos se sincronizaron satisfactoriamente.");
  } catch (err) {
    console.log("❌ Hubo un error al sincronizar los modelos: ", err);
  }
};

syncDb();

module.exports = { Post, Category, User, Bookmark };
