const express = require('express');
const router = express.Router();
const { auth, admin, user } = require('../middleware/auth');
const authController = require('../controllers/authController');

// Rutas públicas
// @route   POST api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', authController.login);

// Rutas para usuarios autenticados (tanto users como admins)
// @route   GET api/auth/user
// @desc    Obtener información del usuario autenticado
// @access  Private
router.get('/user', auth, authController.getUser);

// @route   PUT api/auth/user
// @desc    Actualizar usuario
// @access  Private
router.put('/user', auth, authController.updateUser);

// @route   DELETE api/auth/user
// @desc    Eliminar usuario
// @access  Private
router.delete('/user', auth, authController.deleteUser);

// Rutas exclusivas para administradores
// @route   GET api/auth/users
// @desc    Obtener todos los usuarios
// @access  Admin
router.get('/users', admin, authController.getAllUsers);

// @route   POST api/auth/users
// @desc    Crear un nuevo usuario (por el admin)
// @access  Admin
router.post('/users', admin, authController.createUser);

// @route   PUT api/auth/users/role
// @desc    Actualizar rol de un usuario
// @access  Admin
router.put('/users/role', admin, authController.updateUserRole);

// Necesitamos añadir esta función al authController en lugar de definirla aquí
// @route   DELETE api/auth/users/:id
// @desc    Eliminar un usuario por su ID
// @access  Admin
router.delete('/users/:id', admin, authController.deleteUserById);

module.exports = router;