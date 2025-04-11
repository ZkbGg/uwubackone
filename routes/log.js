// routes/log.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { create } = require('../models/Log');

router.post('/', auth, async (req, res) => {
  const { log } = req.body;
  const usuarioFinal = req.user.name || 'anónimo';

  if (!log) {
    return res.status(400).json({ message: 'No hay log para guardar' });
  }

  try {
    await create({ usuario: usuarioFinal, mensaje: log });
    res.status(200).json({ message: '✅ Log guardado en base de datos' });
  } catch (err) {
    console.error('❌ Error al guardar log en DB:', err);
    res.status(500).json({ message: 'Error al guardar log' });
  }
});

module.exports = router;
