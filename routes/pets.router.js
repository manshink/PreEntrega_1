const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// GET /api/pets - Obtener todas las mascotas
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = 'createdAt' } = req.query;
    
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { [sort]: -1 }
    };

    const pets = await Pet.find({}, null, options).populate('owner');
    const total = await Pet.countDocuments();

    res.json({
      status: 'success',
      payload: pets,
      totalPages: Math.ceil(total / options.limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(total / options.limit) ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(total / options.limit),
      prevLink: page > 1 ? `/api/pets?page=${page - 1}&limit=${limit}` : null,
      nextLink: page < Math.ceil(total / options.limit) ? `/api/pets?page=${parseInt(page) + 1}&limit=${limit}` : null
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching pets',
      error: error.message
    });
  }
});

// GET /api/pets/:id - Obtener mascota por ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner');
    
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Pet not found'
      });
    }

    res.json({
      status: 'success',
      payload: pet
    });
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching pet',
      error: error.message
    });
  }
});

// GET /api/pets/count/total - Obtener cantidad total de mascotas
router.get('/count/total', async (req, res) => {
  try {
    const count = await Pet.countDocuments();
    
    res.json({
      status: 'success',
      payload: { total: count }
    });
  } catch (error) {
    console.error('Error counting pets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error counting pets',
      error: error.message
    });
  }
});

// GET /api/pets/species/:species - Obtener mascotas por especie
router.get('/species/:species', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const species = req.params.species;
    
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const pets = await Pet.find({ species: { $regex: species, $options: 'i' } }, null, options).populate('owner');
    const total = await Pet.countDocuments({ species: { $regex: species, $options: 'i' } });

    res.json({
      status: 'success',
      payload: pets,
      totalPages: Math.ceil(total / options.limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(total / options.limit) ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(total / options.limit)
    });
  } catch (error) {
    console.error('Error fetching pets by species:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching pets by species',
      error: error.message
    });
  }
});

module.exports = router; 