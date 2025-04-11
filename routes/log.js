// routes/log.js
import { Router } from 'express';
const router = Router();
import { auth } from '../middleware/auth';
import { create } from '../models/Log';

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

export default router;
