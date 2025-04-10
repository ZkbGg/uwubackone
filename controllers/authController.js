const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar usuario
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    user = new User({
      name,
      email,
      password,
      // Si se proporciona un rol y el usuario que lo crea es admin, usarlo
      // De lo contrario, por defecto será 'user' según el modelo
      role: role || 'user'
    });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Guardar usuario en la base de datos
    await user.save();

    // Generar JWT
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role // Incluir el rol en el token
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Generar JWT
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role // Incluir el rol en el token
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role // Enviar información del rol al cliente
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener usuario autenticado
exports.getUser = async (req, res) => {
  try {
    // req.user.id viene del middleware de autenticación
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  
  try {
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    // Actualizar campos
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user.id);
    res.json({ msg: 'Usuario eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Crear un usuario (solo para administradores)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    user = new User({
      name,
      email,
      password,
      role: role || 'user' // Por defecto 'user' si no se especifica
    });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Guardar usuario en la base de datos
    await user.save();

    res.status(201).json({ 
      msg: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar rol de usuario (solo para administradores)
exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  
  // Verificar que el rol sea válido
  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ msg: 'Rol inválido' });
  }
  
  try {
    let user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    // Actualizar rol
    user.role = role;
    await user.save();
    
    res.json({ 
      msg: 'Rol actualizado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener todos los usuarios (solo para administradores)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Añade esta función al final de tu authController.js

// Eliminar usuario por ID (solo para administradores)
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Usuario eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};