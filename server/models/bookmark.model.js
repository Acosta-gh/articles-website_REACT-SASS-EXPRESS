const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'bookmark',
  timestamps: true,
  underscored: true,
});

module.exports = Bookmark