const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const Category = require('./category.model')
const User = require('./user.model')

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255],
        },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 499],
        },
    },
    content_highligth: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 99],
        },
    },
    author: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: User, 
            key: 'id', 
        },
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category, 
            key: 'id',       
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'post',
    timestamps: true,
    underscored: true,
});

Post.belongsTo(Category, { foreignKey: 'categoryId' })
Category.hasMany(Post, { foreignKey: 'categoryId' })
Post.belongsTo(User, { foreignKey: 'author', as: 'authorUser' }) 
User.hasMany(Post, { foreignKey: 'author' })

module.exports = Post