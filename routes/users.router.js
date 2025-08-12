const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Este endpoint obtiene todos los usuarios con paginación
router.get('/', async (req, res) => {
  try {
    // Obtenemos los parámetros de la URL (query parameters)
    const { limit = 10, page = 1, sort = 'createdAt' } = req.query;
    
    // Configuramos las opciones para la consulta
    const options = {
      limit: parseInt(limit), // Cuántos usuarios por página
      skip: (parseInt(page) - 1) * parseInt(limit), // Cuántos saltar (para paginación)
      sort: { [sort]: -1 } // Ordenar por el campo que nos pidan (por defecto por fecha de creación)
    };

    // Buscamos los usuarios en la base de datos
    const users = await User.find({}, null, options).populate('pets'); // populate trae también las mascotas
    const total = await User.countDocuments(); // Contamos cuántos usuarios hay en total

    // Calculamos la información de paginación
    res.json({
      status: 'success',
      payload: users,
      totalPages: Math.ceil(total / options.limit), // Total de páginas
      prevPage: page > 1 ? page - 1 : null, // Página anterior
      nextPage: page < Math.ceil(total / options.limit) ? parseInt(page) + 1 : null, // Página siguiente
      page: parseInt(page), // Página actual
      hasPrevPage: page > 1, // Si tiene página anterior
      hasNextPage: page < Math.ceil(total / options.limit), // Si tiene página siguiente
      prevLink: page > 1 ? `/api/users?page=${page - 1}&limit=${limit}` : null, // Link a página anterior
      nextLink: page < Math.ceil(total / options.limit) ? `/api/users?page=${parseInt(page) + 1}&limit=${limit}` : null // Link a página siguiente
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo usuarios',
      error: error.message
    });
  }
});

// GET /api/users/:id - Este endpoint obtiene un usuario específico por su ID
router.get('/:id', async (req, res) => {
  try {
    // Buscamos el usuario por su ID y también traemos sus mascotas
    const user = await User.findById(req.params.id).populate('pets');
    
    // Si no encontramos el usuario, devolvemos error 404
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Si lo encontramos, lo devolvemos
    res.json({
      status: 'success',
      payload: user
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo usuario',
      error: error.message
    });
  }
});

// GET /api/users/count/total - Este endpoint cuenta cuántos usuarios hay en total
router.get('/count/total', async (req, res) => {
  try {
    // Contamos todos los documentos en la colección de usuarios
    const count = await User.countDocuments();
    
    // Devolvemos el total
    res.json({
      status: 'success',
      payload: { total: count }
    });
  } catch (error) {
    console.error('Error contando usuarios:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error contando usuarios',
      error: error.message
    });
  }
});

// Exportamos el router para usarlo en app.js
module.exports = router; 