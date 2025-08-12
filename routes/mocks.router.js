const express = require('express');
const router = express.Router();
const MockingModule = require('../utils/mockingModule');
const User = require('../models/User');
const Pet = require('../models/Pet');

// GET /api/mocks/mockingpets - Endpoint migrado del primer desafío
router.get('/mockingpets', (req, res) => {
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

  res.json({
    status: 'success',
    payload: pets
  });
});

// GET /api/mocks/mockingusers - Generar usuarios con el módulo de mocking
router.get('/mockingusers', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 50;
    const users = await MockingModule.generateUsers(count);
    
    res.json({
      status: 'success',
      payload: users,
      total: users.length
    });
  } catch (error) {
    console.error('Error generating mock users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating mock users',
      error: error.message
    });
  }
});

// POST /api/mocks/generateData - Generar e insertar datos en la base de datos
router.post('/generateData', async (req, res) => {
  try {
    const { users: userCount = 0, pets: petCount = 0 } = req.body;
    
    if (userCount < 0 || petCount < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Count values must be non-negative'
      });
    }

    const results = {
      users: { created: 0, errors: [] },
      pets: { created: 0, errors: [] }
    };

    // Generate and insert users
    if (userCount > 0) {
      const mockUsers = await MockingModule.generateUsers(userCount);
      
      for (const mockUser of mockUsers) {
        try {
          // Remove _id from mock data to let MongoDB generate it
          const { _id, ...userData } = mockUser;
          const user = new User(userData);
          await user.save();
          results.users.created++;
        } catch (error) {
          results.users.errors.push({
            email: mockUser.email,
            error: error.message
          });
        }
      }
    }

    // Generate and insert pets
    if (petCount > 0) {
      const mockPets = MockingModule.generatePets(petCount);
      
      for (const mockPet of mockPets) {
        try {
          // Remove _id from mock data to let MongoDB generate it
          const { _id, ...petData } = mockPet;
          const pet = new Pet(petData);
          await pet.save();
          results.pets.created++;
        } catch (error) {
          results.pets.errors.push({
            name: mockPet.name,
            error: error.message
          });
        }
      }
    }

    res.json({
      status: 'success',
      message: 'Data generated and inserted successfully',
      results: results
    });

  } catch (error) {
    console.error('Error generating data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating and inserting data',
      error: error.message
    });
  }
});

module.exports = router; 