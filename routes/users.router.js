const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: 'object'
 *       properties:
 *         status:
 *           type: 'string'
 *           example: 'success'
 *         payload:
 *           type: 'array'
 *           items:
 *             $ref: '#/components/schemas/User'
 *         totalPages:
 *           type: 'number'
 *           description: 'Total de páginas'
 *         prevPage:
 *           type: 'number'
 *           nullable: true
 *           description: 'Página anterior'
 *         nextPage:
 *           type: 'number'
 *           nullable: true
 *           description: 'Página siguiente'
 *         page:
 *           type: 'number'
 *           description: 'Página actual'
 *         hasPrevPage:
 *           type: 'boolean'
 *           description: 'Tiene página anterior'
 *         hasNextPage:
 *           type: 'boolean'
 *           description: 'Tiene página siguiente'
 *         prevLink:
 *           type: 'string'
 *           nullable: true
 *           description: 'Link a página anterior'
 *         nextLink:
 *           type: 'string'
 *           nullable: true
 *           description: 'Link a página siguiente'
 *     UserSingleResponse:
 *       type: 'object'
 *       properties:
 *         status:
 *           type: 'string'
 *           example: 'success'
 *         payload:
 *           $ref: '#/components/schemas/User'
 *     UserCountResponse:
 *       type: 'object'
 *       properties:
 *         status:
 *           type: 'string'
 *           example: 'success'
 *         payload:
 *           type: 'object'
 *           properties:
 *             total:
 *               type: 'number'
 *               description: 'Total de usuarios'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios con paginación
 *     description: Retorna una lista paginada de todos los usuarios registrados en el sistema
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de usuarios por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Campo por el cual ordenar los resultados
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Retorna la información de un usuario específico incluyendo sus mascotas
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSingleResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/users/count/total:
 *   get:
 *     summary: Contar total de usuarios
 *     description: Retorna el número total de usuarios registrados en el sistema
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Conteo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCountResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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