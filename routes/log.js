// routes/log.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.post('/', auth, (req, res) => {
  const { log, usuario } = req.body;
  
  // Ahora podemos acceder a req.user.name que fue incluido en el token
  const usuarioFinal = req.user.name || usuario || 'anónimo';

  if (!log) {
    return res.status(400).json({ message: 'No hay log para guardar' });
  }

  const logDir = path.join(__dirname, '../logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const date = new Date().toISOString().split('T')[0];
  const logPath = path.join(logDir, `${date}.txt`);

  const timestamp = new Date().toISOString();
  const fullLog = `[${timestamp}] [Usuario: ${usuarioFinal}] ${log}\n`;

  fs.appendFile(logPath, fullLog, (err) => {
    if (err) {
      console.error('❌ Error al guardar log:', err);
      return res.status(500).json({ message: 'Error al guardar log' });
    }
    res.status(200).json({ message: '✅ Log guardado' });
  });
});

module.exports = router;