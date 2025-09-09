const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User');

// GET /api/adoption - Obtener todas las mascotas disponibles para adopción
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, species, age_min, age_max } = req.query;
    
    // Construir filtros de búsqueda
    const filters = {};
    if (species) {
      filters.species = { $regex: species, $options: 'i' };
    }
    if (age_min || age_max) {
      filters.age = {};
      if (age_min) filters.age.$gte = parseInt(age_min);
      if (age_max) filters.age.$lte = parseInt(age_max);
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 }
    };

    const pets = await Pet.find(filters, null, options).populate('owner');
    const total = await Pet.countDocuments(filters);

    res.json({
      status: 'success',
      payload: pets,
      totalPages: Math.ceil(total / options.limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(total / options.limit) ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(total / options.limit),
      prevLink: page > 1 ? `/api/adoption?page=${page - 1}&limit=${limit}` : null,
      nextLink: page < Math.ceil(total / options.limit) ? `/api/adoption?page=${parseInt(page) + 1}&limit=${limit}` : null
    });
  } catch (error) {
    console.error('Error obteniendo mascotas para adopción:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo mascotas para adopción',
      error: error.message
    });
  }
});

// GET /api/adoption/:id - Obtener una mascota específica para adopción
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner');
    
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Mascota no encontrada'
      });
    }

    res.json({
      status: 'success',
      payload: pet
    });
  } catch (error) {
    console.error('Error obteniendo mascota para adopción:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo mascota para adopción',
      error: error.message
    });
  }
});

// POST /api/adoption/:petId/adopt - Adoptar una mascota
router.post('/:petId/adopt', async (req, res) => {
  try {
    const { petId } = req.params;
    const { userId } = req.body;

    // Validar que se proporcione el userId
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Se requiere el ID del usuario adoptante'
      });
    }

    // Verificar que la mascota existe
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Mascota no encontrada'
      });
    }

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que la mascota no tiene dueño actual
    if (pet.owner) {
      return res.status(400).json({
        status: 'error',
        message: 'Esta mascota ya tiene un dueño'
      });
    }

    // Asignar la mascota al usuario
    pet.owner = userId;
    pet.updatedAt = new Date();
    await pet.save();

    // Agregar la mascota a la lista de mascotas del usuario
    user.pets.push(petId);
    user.updatedAt = new Date();
    await user.save();

    // Obtener la mascota actualizada con el dueño
    const updatedPet = await Pet.findById(petId).populate('owner');

    res.json({
      status: 'success',
      message: '¡Mascota adoptada exitosamente!',
      payload: updatedPet
    });
  } catch (error) {
    console.error('Error adoptando mascota:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adoptando mascota',
      error: error.message
    });
  }
});

// PUT /api/adoption/:petId/return - Devolver una mascota (liberarla para adopción)
router.put('/:petId/return', async (req, res) => {
  try {
    const { petId } = req.params;
    const { userId } = req.body;

    // Validar que se proporcione el userId
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Se requiere el ID del usuario'
      });
    }

    // Verificar que la mascota existe
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Mascota no encontrada'
      });
    }

    // Verificar que el usuario es el dueño actual
    if (pet.owner.toString() !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para devolver esta mascota'
      });
    }

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Liberar la mascota
    pet.owner = null;
    pet.updatedAt = new Date();
    await pet.save();

    // Remover la mascota de la lista del usuario
    user.pets = user.pets.filter(pet => pet.toString() !== petId);
    user.updatedAt = new Date();
    await user.save();

    res.json({
      status: 'success',
      message: 'Mascota devuelta exitosamente para adopción',
      payload: pet
    });
  } catch (error) {
    console.error('Error devolviendo mascota:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error devolviendo mascota',
      error: error.message
    });
  }
});

// GET /api/adoption/user/:userId - Obtener mascotas adoptadas por un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 }
    };

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Obtener mascotas del usuario
    const pets = await Pet.find({ owner: userId }, null, options).populate('owner');
    const total = await Pet.countDocuments({ owner: userId });

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
    console.error('Error obteniendo mascotas del usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo mascotas del usuario',
      error: error.message
    });
  }
});

// GET /api/adoption/stats/overview - Obtener estadísticas generales de adopciones
router.get('/stats/overview', async (req, res) => {
  try {
    const totalPets = await Pet.countDocuments();
    const adoptedPets = await Pet.countDocuments({ owner: { $ne: null } });
    const availablePets = totalPets - adoptedPets;
    const totalUsers = await User.countDocuments();
    const usersWithPets = await User.countDocuments({ pets: { $exists: true, $ne: [] } });

    // Estadísticas por especie
    const speciesStats = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          total: { $sum: 1 },
          adopted: {
            $sum: {
              $cond: [{ $ne: ['$owner', null] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          species: '$_id',
          total: 1,
          adopted: 1,
          available: { $subtract: ['$total', '$adopted'] }
        }
      }
    ]);

    res.json({
      status: 'success',
      payload: {
        overview: {
          totalPets,
          adoptedPets,
          availablePets,
          adoptionRate: totalPets > 0 ? ((adoptedPets / totalPets) * 100).toFixed(2) : 0
        },
        users: {
          totalUsers,
          usersWithPets,
          adoptionParticipation: totalUsers > 0 ? ((usersWithPets / totalUsers) * 100).toFixed(2) : 0
        },
        speciesStats
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo estadísticas de adopción',
      error: error.message
    });
  }
});

module.exports = router;

