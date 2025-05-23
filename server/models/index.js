const sequelize = require("../config/database");

const Post = require("./post.model");
const Category = require("./category.model");
const User = require("./user.model");
const Bookmark = require("./bookmark.model");
const Comment = require("./comment.model");

// Relaciones 
Post.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Post, { foreignKey: 'categoryId' });

Post.belongsTo(User, { foreignKey: 'author', as: 'authorUser' });
User.hasMany(Post, { foreignKey: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

Comment.hasMany(Comment, { as: "childrenComment", foreignKey: 'commentId' })
Comment.belongsTo(Comment, { as: "parentComment", foreignKey: 'commentId' })

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
    console.log("✅ Models synchronized successfully.");
  } catch (err) {
    console.log("❌ Error synchronizing models:", err);
  }
};

syncDb();

module.exports = {
  sequelize,
  Post,
  Category,
  User,
  Bookmark,
  Comment,
};