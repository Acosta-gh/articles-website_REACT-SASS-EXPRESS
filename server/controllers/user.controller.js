const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Crear usuario
const createUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const itExists = await User.findOne({ where: { email } });
        if (itExists) {
            return res.status(400).json({ error: "❌ The email is already registered." });
        }
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: 0
        });
        const token = jwt.sign(
            { id: newUser.id, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: "✅ Usuario creado satisfactoriamente.",
            email: newUser.email,
            name: newUser.name,
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] } // Excluir el campo de contraseña!
        });

        if (!user) {
            return res.status(404).json({ error: "❌ User not found." });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "❌ User not found." });
        }

        await user.destroy();
        res.status(200).json({ message: "✅ User deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const name = req.body ? req.body.name : null;
        const image = req.file ? req.file.filename : null;

        if (!name && !image) {
            return res.status(400).json({ error: "⚠️ No data provided." });
        }
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: '❌ User not found.' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (image) updateData.image = image;

        await user.update(updateData);

        res.status(200).json({
            message: '✅ User updated.',
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "❌ User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "❌ Incorrect password." });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ mensaje: "✅ Login successful.", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUserById, createUser, deleteUser, loginUser, updateUser };
