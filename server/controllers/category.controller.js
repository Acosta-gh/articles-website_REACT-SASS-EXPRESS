// controllers/category.controller.js
const Category = require('../models/category.model');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.json(categories); 
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllCategories,
};
