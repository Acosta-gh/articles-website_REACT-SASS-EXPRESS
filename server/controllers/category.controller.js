const { Category } = require("../models")

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll()
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const editCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ error: "❌ Category not found." });
        }

        const { name } = req.body;

        await category.update({ name });

        res.json({ message: "✅ Category updated successfully.", category });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCatoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id)
        if (!category) {
            return res.status(400).json({ error: "❌ The specified category does not exist." })
        }
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body)
        res.status(201).json(category)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: { id: req.params.id }
        });

        if (!category) {
            return res.status(400).json({ error: "❌ The specified category does not exist." })
        }

        await category.destroy();

        res.status(200).json({ message: "✅ Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports = { getAllCategories, getCatoryById, createCategory, deleteCategory, editCategory }