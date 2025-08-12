const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importamos los routers que creamos
const mocksRouter = require('./routes/mocks.router');
const usersRouter = require('./routes/users.router');
const petsRouter = require('./routes/pets.router');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuramos los middlewares básicos que necesitamos
app.use(cors()); // Esto permite que otros dominios puedan hacer peticiones a nuestra API
app.use(express.json()); // Para poder leer JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Para leer datos de formularios

// Conectamos a MongoDB - esto es lo que aprendimos en clase sobre bases de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mocks-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('¡Conectado a MongoDB! 🎉'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Configuramos las rutas - cada router maneja su propia sección de la API
app.use('/api/mocks', mocksRouter); // Este es el router principal que nos piden
app.use('/api/users', usersRouter); // Para manejar usuarios
app.use('/api/pets', petsRouter); // Para manejar mascotas

// Endpoint de prueba para ver si el servidor está funcionando
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '¡El servidor está funcionando!' });
});

// Middleware para manejar errores - esto es importante para que no se rompa todo
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '¡Ups! Algo salió mal 😅' });
});

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
}); 