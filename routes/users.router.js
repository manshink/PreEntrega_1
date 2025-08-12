const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = 'createdAt' } = req.query;
    
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { [sort]: -1 }
    };

    const users = await User.find({}, null, options).populate('pets');
    const total = await User.countDocuments();

    res.json({
      status: 'success',
      payload: users,
      totalPages: Math.ceil(total / options.limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(total / options.limit) ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(total / options.limit),
      prevLink: page > 1 ? `/api/users?page=${page - 1}&limit=${limit}` : null,
      nextLink: page < Math.ceil(total / options.limit) ? `/api/users?page=${parseInt(page) + 1}&limit=${limit}` : null
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('pets');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      payload: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// GET /api/users/count - Obtener cantidad total de usuarios
router.get('/count/total', async (req, res) => {
  try {
    const count = await User.countDocuments();
    
    res.json({
      status: 'success',
      payload: { total: count }
    });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error counting users',
      error: error.message
    });
  }
});

module.exports = router; 