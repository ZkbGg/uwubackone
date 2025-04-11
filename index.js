const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// 🟢 Configurar CORS antes que cualquier ruta o middleware
app.use(cors({
  origin: 'https://uwufront.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}));

// 🟢 Middleware para procesar datos en formato JSON y formularios grandes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🟢 Definir rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/personas', require('./routes/personas'));
app.use('/api/log', require('./routes/log').default);

// 🟢 Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));
