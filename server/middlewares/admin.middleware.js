const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Asumiendo que el token se envía como "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "❌ Acceso denegado. No se proporcionó un token." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 

        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "❌ Acceso denegado. Se requieren privilegios de administrador." });
        }

        next(); 
    } catch (error) {
        return res.status(400).json({ error: "❌ Token no válido." });
    }
};

module.exports = adminMiddleware;
