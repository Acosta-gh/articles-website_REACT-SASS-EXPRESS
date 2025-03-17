const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(password);
        console.log(email);
        const itExists = await User.findOne({ where: { email: email } });
        if (itExists) {
            return res.status(400).json({ error: "❌ El mail ya se encuentra registrado." });
        }

        const newUser = await User.create({ name: name, email: email, password: hashedPassword, isAdmin: 0 });

        const token = jwt.sign(
            { id: newUser.id, name:name, email: newUser.email, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "✅ Usuario creado satisfactoriamente.",
            email: newUser.email,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params.id
        const user = User.findByPk(id)
        if (!user) {
            res.status(404)
        }
        await user.destroy()
        res.status(200).json({ message: "✅ Usuario borrado satisfactoriamente." })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateUser = async (req, res) => { // Incompleto
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ error: '❌ Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "❌ Contraseña incorrecta." });
        }

        const { id, ...restBody } = req.body;

        await user.update(restBody);

        res.status(200).json({ message: '✅ Usuario actualizado.', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "❌ Usuario no encontrado." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "❌ Contraseña incorrecta." });
        }

        const token = jwt.sign({ id: user.id, name:user.name ,email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "✅ Inicio de sesión exitoso.", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { createUser, deleteUser, loginUser, updateUser }