// routes/personas.js
const express = require('express');
const router = express.Router();
// Actualizamos la importación para usar la nueva estructura
const { auth } = require('../middleware/auth'); // Importamos específicamente la función auth
const Persona = require('../models/Persona');

// GET /api/personas
router.get('/', auth, async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// POST /api/personas
router.post('/', auth, async (req, res) => {
  try {
    const { nombre, apellido, cantidad } = req.body;
    const nuevaPersona = new Persona({ nombre, apellido, cantidad });
    await nuevaPersona.save();
    res.status(201).json(nuevaPersona);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// PUT /api/personas/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { cantidad } = req.body;
    const persona = await Persona.findByIdAndUpdate(req.params.id, { cantidad }, { new: true });
    
    if (!persona) {
      return res.status(404).json({ msg: 'Persona no encontrada' });
    }
    
    res.json(persona);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;