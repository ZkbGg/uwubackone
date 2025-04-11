// models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  usuario: { type: String, default: 'anónimo' },
  mensaje: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
