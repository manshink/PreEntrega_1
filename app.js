  const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Importamos los routers que creamos
const mocksRouter = require('./routes/mocks.router');
const usersRouter = require('./routes/users.router');
const petsRouter = require('./routes/pets.router');
const adoptionRouter = require('./routes/adoption.router');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Adoption API',
      version: '1.0.0',
      description: 'API para gestión de mascotas y adopciones',
      contact: {
        name: 'API Support',
        email: 'support@petadoption.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            password: {
              type: 'string',
              description: 'Contraseña encriptada'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario'
            },
            pets: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'IDs de las mascotas del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de actualización'
            }
          }
        },
        Pet: {
          type: 'object',
          required: ['name', 'species', 'breed', 'age'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la mascota'
            },
            name: {
              type: 'string',
              description: 'Nombre de la mascota'
            },
            species: {
              type: 'string',
              description: 'Especie de la mascota'
            },
            breed: {
              type: 'string',
              description: 'Raza de la mascota'
            },
            age: {
              type: 'number',
              minimum: 0,
              description: 'Edad de la mascota'
            },
            owner: {
              type: 'string',
              description: 'ID del dueño de la mascota'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de actualización'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            error: {
              type: 'string',
              description: 'Detalles del error'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Archivos que contienen las anotaciones de Swagger
};

const specs = swaggerJsdoc(swaggerOptions);

// Configuramos los middlewares básicos que necesitamos
app.use(cors()); // Esto permite que otros dominios puedan hacer peticiones a nuestra API
app.use(express.json()); // Para poder leer JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Para leer datos de formularios

// Configuramos Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pet Adoption API Documentation'
}));

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
app.use('/api/adoption', adoptionRouter); // Para manejar adopciones

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