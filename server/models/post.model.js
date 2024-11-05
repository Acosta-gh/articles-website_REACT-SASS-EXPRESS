// models/post.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    content_thumbnail: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content_full: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'archived', 'deleted'),
        defaultValue: 'active',
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        }
    }
}, {
    timestamps: true,
    tableName: 'post'
});

Post.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Post, { foreignKey: 'categoryId' });

module.exports = Post;
