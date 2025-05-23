const jwt = require('jsonwebtoken');

const optionalAuthMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
  if (!token) {
    // No hay token: sigue sin error y sin req.user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Token inválido: simplemente no asignamos req.user
  }

  next();
};

module.exports = optionalAuthMiddleware;