const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Asumiendo que el token se envía como "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "❌ Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 

        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "❌ Access denied. Admin privileges are required." });
        }

        next(); 
    } catch (error) {
        return res.status(400).json({ error: "❌ Invalid token." });
    }
};

module.exports = adminMiddleware;
