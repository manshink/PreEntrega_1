const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// GET /api/pets - Este endpoint obtiene todas las mascotas con paginación
router.get('/', async (req, res) => {
  try {
    // Obtenemos los parámetros de la URL (query parameters)
    const { limit = 10, page = 1, sort = 'createdAt' } = req.query;
    
    // Configuramos las opciones para la consulta
    const options = {
      limit: parseInt(limit), // Cuántas mascotas por página
      skip: (parseInt(page) - 1) * parseInt(limit), // Cuántas saltar (para paginación)
      sort: { [sort]: -1 } // Ordenar por el campo que nos pidan (por defecto por fecha de creación)
    };

    // Buscamos las mascotas en la base de datos
    const pets = await Pet.find({}, null, options).populate('owner'); // populate trae también el dueño
    const total = await Pet.countDocuments(); // Contamos cuántas mascotas hay en total

    // Calculamos la información de paginación
    res.json({
      status: 'success',
      payload: pets,
      totalPages: Math.ceil(total / options.limit), // Total de páginas
      prevPage: page > 1 ? page - 1 : null, // Página anterior
      nextPage: page < Math.ceil(total / options.limit) ? parseInt(page) + 1 : null, // Página siguiente
      page: parseInt(page), // Página actual
      hasPrevPage: page > 1, // Si tiene página anterior
      hasNextPage: page < Math.ceil(total / options.limit), // Si tiene página siguiente
      prevLink: page > 1 ? `/api/pets?page=${page - 1}&limit=${limit}` : null, // Link a página anterior
      nextLink: page < Math.ceil(total / options.limit) ? `/api/pets?page=${parseInt(page) + 1}&limit=${limit}` : null // Link a página siguiente
    });
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo mascotas',
      error: error.message
    });
  }
});

// GET /api/pets/:id - Este endpoint obtiene una mascota específica por su ID
router.get('/:id', async (req, res) => {
  try {
    // Buscamos la mascota por su ID y también traemos su dueño
    const pet = await Pet.findById(req.params.id).populate('owner');
    
    // Si no encontramos la mascota, devolvemos error 404
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Mascota no encontrada'
      });
    }

    // Si la encontramos, la devolvemos
    res.json({
      status: 'success',
      payload: pet
    });
  } catch (error) {
    console.error('Error obteniendo mascota:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo mascota',
      error: error.message
    });
  }
});

// GET /api/pets/count/total - Este endpoint cuenta cuántas mascotas hay en total
router.get('/count/total', async (req, res) => {
  try {
    // Contamos todos los documentos en la colección de mascotas
    const count = await Pet.countDocuments();
    
    // Devolvemos el total
    res.json({
      status: 'success',
      payload: { total: count }
    });
  } catch (error) {
    console.error('Error contando mascotas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error contando mascotas',
      error: error.message
    });
  }
});

// GET /api/pets/species/:species - Este endpoint busca mascotas por especie
router.get('/species/:species', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const species = req.params.species; // La especie que nos piden buscar
    
    // Configuramos las opciones para la consulta
    const options = {
      limit: parseInt(limit), // Cuántas mascotas por página
      skip: (parseInt(page) - 1) * parseInt(limit) // Cuántas saltar (para paginación)
    };

    // Buscamos mascotas que coincidan con la especie (ignorando mayúsculas/minúsculas)
    const pets = await Pet.find({ species: { $regex: species, $options: 'i' } }, null, options).populate('owner');
    const total = await Pet.countDocuments({ species: { $regex: species, $options: 'i' } });

    // Calculamos la información de paginación
    res.json({
      status: 'success',
      payload: pets,
      totalPages: Math.ceil(total / options.limit), // Total de páginas
      prevPage: page > 1 ? page - 1 : null, // Página anterior
      nextPage: page < Math.ceil(total / options.limit) ? parseInt(page) + 1 : null, // Página siguiente
      page: parseInt(page), // Página actual
      hasPrevPage: page > 1, // Si tiene página anterior
      hasNextPage: page < Math.ceil(total / options.limit) // Si tiene página siguiente
    });
  } catch (error) {
    console.error('Error obteniendo mascotas por especie:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo mascotas por especie',
      error: error.message
    });
  }
});

// Exportamos el router para usarlo en app.js
module.exports = router; 