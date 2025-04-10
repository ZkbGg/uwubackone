const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware para procesar datos en formato JSON
app.use(express.json());

// Aumentar límite de headers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Definir rutas
app.use('/api/auth', require('./routes/auth'));

const personasRoute = require('./routes/personas');
app.use('/api/personas', personasRoute);

const PORT = process.env.PORT || 5000;

const logRoute = require('./routes/log');
app.use('/api/log', logRoute);

app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));