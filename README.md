# PreEntrega 1 - Backend con Router de Mocks

Este proyecto implementa un sistema backend con Express.js y MongoDB que incluye un router de mocks para generar datos de prueba.

## Características

- **Router de Mocks**: Maneja endpoints para generar datos de prueba
- **Generación de Usuarios**: Crea usuarios con contraseñas encriptadas y roles variados
- **Generación de Mascotas**: Crea mascotas con diferentes especies y razas
- **Inserción en Base de Datos**: Permite generar e insertar datos directamente en MongoDB
- **APIs de Consulta**: Endpoints para verificar los datos insertados

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con:
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/mocks-db
NODE_ENV=development
```

4. Asegúrate de tener MongoDB ejecutándose localmente

## Uso

### Iniciar el servidor
```bash
npm start
# o para desarrollo
npm run dev
```

### Endpoints Disponibles

#### Router de Mocks (`/api/mocks`)

1. **GET `/api/mocks/mockingpets`**
   - Retorna una lista de mascotas de ejemplo
   - Endpoint migrado del primer desafío

2. **GET `/api/mocks/mockingusers`**
   - Genera usuarios de prueba usando el módulo de mocking
   - Parámetros opcionales:
     - `count`: Número de usuarios a generar (default: 50)
   - Ejemplo: `GET /api/mocks/mockingusers?count=10`

3. **POST `/api/mocks/generateData`**
   - Genera e inserta datos en la base de datos
   - Body:
     ```json
     {
       "users": 10,
       "pets": 5
     }
     ```

#### Router de Usuarios (`/api/users`)

1. **GET `/api/users`**
   - Obtiene todos los usuarios con paginación
   - Parámetros: `limit`, `page`, `sort`

2. **GET `/api/users/:id`**
   - Obtiene un usuario específico por ID

3. **GET `/api/users/count/total`**
   - Obtiene el total de usuarios en la base de datos

#### Router de Mascotas (`/api/pets`)

1. **GET `/api/pets`**
   - Obtiene todas las mascotas con paginación
   - Parámetros: `limit`, `page`, `sort`

2. **GET `/api/pets/:id`**
   - Obtiene una mascota específica por ID

3. **GET `/api/pets/count/total`**
   - Obtiene el total de mascotas en la base de datos

4. **GET `/api/pets/species/:species`**
   - Obtiene mascotas filtradas por especie

## Estructura del Proyecto

```
PreEntrega_1/
├── app.js                 # Archivo principal de la aplicación
├── package.json           # Dependencias del proyecto
├── models/
│   ├── User.js           # Modelo de Usuario
│   └── Pet.js            # Modelo de Mascota
├── routes/
│   ├── mocks.router.js   # Router de mocks
│   ├── users.router.js   # Router de usuarios
│   └── pets.router.js    # Router de mascotas
└── utils/
    └── mockingModule.js  # Módulo para generar datos de prueba
```

## Características del Módulo de Mocking

### Usuarios Generados
- **Password**: Siempre "coder123" encriptada con bcrypt
- **Role**: Alterna entre "user" y "admin"
- **Pets**: Array vacío por defecto
- **Datos**: Nombres, apellidos y emails generados con faker

### Mascotas Generadas
- **Especies**: Dog, Cat, Bird, Fish, Hamster, Rabbit
- **Razas**: Variadas según la especie
- **Edad**: Entre 1 y 15 años
- **Datos**: Nombres generados con faker

## Ejemplos de Uso

### Generar 50 usuarios de prueba
```bash
curl http://localhost:8080/api/mocks/mockingusers
```

### Generar e insertar 10 usuarios y 5 mascotas
```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 10, "pets": 5}'
```

### Verificar usuarios insertados
```bash
curl http://localhost:8080/api/users
```

### Verificar mascotas insertadas
```bash
curl http://localhost:8080/api/pets
```

## Tecnologías Utilizadas

- **Express.js**: Framework web
- **MongoDB**: Base de datos
- **Mongoose**: ODM para MongoDB
- **bcrypt**: Encriptación de contraseñas
- **faker**: Generación de datos de prueba
- **cors**: Middleware para CORS
- **dotenv**: Variables de entorno

## Criterios de Evaluación Cumplidos

✅ **Creación del Router Mocks y Migración de Endpoints**
- Router `mocks.router.js` creado bajo `/api/mocks`
- Endpoint `/mockingpets` migrado exitosamente

✅ **Desarrollo del Módulo de Mocking**
- Módulo que genera usuarios según parámetro numérico
- Contraseñas encriptadas con "coder123"
- Roles variados (user/admin)
- Arrays de pets vacíos

✅ **Endpoint GET `/mockingusers`**
- Genera 50 usuarios por defecto
- Formato compatible con MongoDB
- Utiliza el módulo de mocking

✅ **Endpoint POST `/generateData`**
- Recibe parámetros `users` y `pets`
- Genera e inserta en base de datos
- Manejo de errores incluido

✅ **Comprobación de Registros**
- Servicios GET de users y pets implementados
- Verificación de datos insertados
- Paginación y filtros incluidos 