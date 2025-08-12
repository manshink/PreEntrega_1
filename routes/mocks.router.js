const express = require('express');
const router = express.Router();
const MockingModule = require('../utils/mockingModule');
const User = require('../models/User');
const Pet = require('../models/Pet');

// GET /api/mocks/mockingpets - Este es el endpoint que nos piden migrar del primer desafío
router.get('/mockingpets', (req, res) => {
  // Aquí tenemos una lista de mascotas de ejemplo - esto es lo que teníamos antes
  const pets = [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      age: 3,
      owner: "507f1f77bcf86cd799439012",
      createdAt: "2023-01-15T10:30:00.000Z",
      updatedAt: "2023-01-15T10:30:00.000Z"
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "Whiskers",
      species: "Cat",
      breed: "Persian",
      age: 2,
      owner: "507f1f77bcf86cd799439014",
      createdAt: "2023-02-20T14:45:00.000Z",
      updatedAt: "2023-02-20T14:45:00.000Z"
    },
    {
      _id: "507f1f77bcf86cd799439015",
      name: "Polly",
      species: "Bird",
      breed: "Parakeet",
      age: 1,
      owner: "507f1f77bcf86cd799439016",
      createdAt: "2023-03-10T09:15:00.000Z",
      updatedAt: "2023-03-10T09:15:00.000Z"
    },
    {
      _id: "507f1f77bcf86cd799439017",
      name: "Nemo",
      species: "Fish",
      breed: "Goldfish",
      age: 1,
      owner: "507f1f77bcf86cd799439018",
      createdAt: "2023-04-05T16:20:00.000Z",
      updatedAt: "2023-04-05T16:20:00.000Z"
    },
    {
      _id: "507f1f77bcf86cd799439019",
      name: "Fluffy",
      species: "Hamster",
      breed: "Syrian",
      age: 1,
      owner: "507f1f77bcf86cd799439020",
      createdAt: "2023-05-12T11:30:00.000Z",
      updatedAt: "2023-05-12T11:30:00.000Z"
    }
  ];

  // Retornamos las mascotas en formato JSON
  res.json({
    status: 'success',
    payload: pets
  });
});

// GET /api/mocks/mockingusers - Este endpoint genera usuarios usando nuestro módulo de mocking
router.get('/mockingusers', async (req, res) => {
  try {
    // Obtenemos la cantidad de usuarios que queremos generar (por defecto 50)
    const count = parseInt(req.query.count) || 50;
    // Usamos nuestro módulo para generar los usuarios
    const users = await MockingModule.generateUsers(count);
    
    // Retornamos los usuarios generados
    res.json({
      status: 'success',
      payload: users,
      total: users.length
    });
  } catch (error) {
    console.error('Error generando usuarios falsos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generando usuarios falsos',
      error: error.message
    });
  }
});

// POST /api/mocks/generateData - Este endpoint genera datos y los guarda en la base de datos
router.post('/generateData', async (req, res) => {
  try {
    // Obtenemos cuántos usuarios y mascotas queremos crear
    const { users: userCount = 0, pets: petCount = 0 } = req.body;
    
    // Validamos que los números no sean negativos
    if (userCount < 0 || petCount < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Los valores deben ser números positivos'
      });
    }

    // Objeto para guardar los resultados
    const results = {
      users: { created: 0, errors: [] },
      pets: { created: 0, errors: [] }
    };

    // Generamos e insertamos usuarios si nos piden más de 0
    if (userCount > 0) {
      const mockUsers = await MockingModule.generateUsers(userCount);
      
      // Recorremos cada usuario generado
      for (const mockUser of mockUsers) {
        try {
          // Removemos el _id del mock para que MongoDB genere uno nuevo
          const { _id, ...userData } = mockUser;
          const user = new User(userData);
          await user.save(); // Guardamos en la base de datos
          results.users.created++; // Contamos cuántos se crearon
        } catch (error) {
          // Si hay error, lo guardamos para reportarlo
          results.users.errors.push({
            email: mockUser.email,
            error: error.message
          });
        }
      }
    }

    // Generamos e insertamos mascotas si nos piden más de 0
    if (petCount > 0) {
      const mockPets = MockingModule.generatePets(petCount);
      
      // Recorremos cada mascota generada
      for (const mockPet of mockPets) {
        try {
          // Removemos el _id del mock para que MongoDB genere uno nuevo
          const { _id, ...petData } = mockPet;
          const pet = new Pet(petData);
          await pet.save(); // Guardamos en la base de datos
          results.pets.created++; // Contamos cuántas se crearon
        } catch (error) {
          // Si hay error, lo guardamos para reportarlo
          results.pets.errors.push({
            name: mockPet.name,
            error: error.message
          });
        }
      }
    }

    // Retornamos el resultado de todo el proceso
    res.json({
      status: 'success',
      message: '¡Datos generados e insertados exitosamente! 🎉',
      results: results
    });

  } catch (error) {
    console.error('Error generando datos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generando e insertando datos',
      error: error.message
    });
  }
});

// Exportamos el router para usarlo en app.js
module.exports = router; 