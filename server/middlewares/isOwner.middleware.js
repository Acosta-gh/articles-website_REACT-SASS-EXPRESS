/*
const jwt = require("jsonwebtoken");

const isOwnerMiddleware = (req, res, next) => {
    try {
        const authenticatedUserId = req.user.id;
        const targetUserId = parseInt(req.params.id || req.body.id);

        if (authenticatedUserId !== targetUserId) {
            return res.status(403).json({ message: "❌ No tenés permiso para modificar este usuario." });
        }

        next();
    } catch (error) {
        return res.status(400).json({ error: "❌ Token no válido.", error });
    }
};

module.exports = isOwnerMiddleware;
*/