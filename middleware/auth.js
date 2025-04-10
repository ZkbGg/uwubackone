const jwt = require('jsonwebtoken');

// Middleware original para verificar token
const auth = function(req, res, next) {
  // Obtener token del header
  const token = req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  // Verificar token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};

// Middleware para verificar si el usuario es administrador
const admin = function(req, res, next) {
  // Primero verifica que el usuario esté autenticado
  auth(req, res, () => {
    // Luego verifica si es admin
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ msg: 'Acceso denegado: se requiere rol de administrador' });
    }
  });
};

// Middleware para verificar si el usuario es un usuario regular o admin
const user = function(req, res, next) {
  // Primero verifica que el usuario esté autenticado
  auth(req, res, () => {
    // Luego verifica si es usuario o admin (ambos tienen acceso)
    if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
      next();
    } else {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
  });
};

module.exports = {
  auth,
  admin,
  user
};