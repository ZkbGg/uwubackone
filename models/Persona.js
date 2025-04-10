const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Persona', PersonaSchema);
