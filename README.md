# 🎓 PreEntrega 1 - Backend con Router de Mocks y Docker

¡Hola! 👋 Este es mi proyecto para la **PreEntrega 1** del curso de Backend en Coderhouse. Estoy súper emocionado de compartir lo que he aprendido y construido.

## 🐳 Docker Hub

**Imagen de Docker disponible en:** [Docker Hub - Pet Adoption API](https://hub.docker.com/r/manshink/pet-adoption-api)

```bash
# Para ejecutar la imagen desde Docker Hub
docker run -p 8080:8080 manshink/pet-adoption-api:latest

# O con Docker Compose (incluye MongoDB)
docker-compose up -d
```

> **Nota:** La imagen está disponible en Docker Hub como `manshink/pet-adoption-api:latest`. Ver [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) para instrucciones detalladas de despliegue.

## 🤔 ¿De qué se trata este proyecto?

Bueno, básicamente tuve que crear un **router de mocks** (que es como una sección especial de mi API) que hace varias cosas cool:

- **Genera datos falsos** para probar cosas (como usuarios y mascotas)
- **Migra un endpoint** que ya había hecho antes
- **Guarda datos en una base de datos** real (MongoDB)
- **Verifica que todo funcione** correctamente
- **Sistema completo de adopciones** con funcionalidades avanzadas
- **Documentación con Swagger** para facilitar el uso de la API
- **Dockerización completa** para fácil despliegue

Es como crear un "laboratorio" donde puedo generar datos de prueba sin tener que escribirlos manualmente. ¡Muy útil para cuando estoy desarrollando!

## 🚀 ¿Qué aprendí haciendo esto?

### 1. **Routers en Express.js**
Aprendí a organizar mejor mi código separando las rutas en archivos diferentes. Antes tenía todo en un solo archivo y era un desastre 😅

### 2. **Módulos de Mocking**
Creé un módulo que genera datos falsos automáticamente. Es como tener una "fábrica" de usuarios y mascotas que puedo usar para probar mi aplicación.

### 3. **Bases de Datos con MongoDB**
Conecté mi aplicación a MongoDB y aprendí a guardar y recuperar datos. ¡Es súper emocionante ver cómo los datos se guardan en una base de datos real!

### 4. **Encriptación de Contraseñas**
Aprendí a usar bcrypt para encriptar contraseñas de forma segura. Ahora mis usuarios están protegidos 🔒

### 5. **Sistema de Adopciones**
Creé un sistema completo para manejar adopciones de mascotas con validaciones, estadísticas y control de permisos.

### 6. **Documentación con Swagger**
Implementé documentación automática de la API usando Swagger, lo que hace mucho más fácil entender y usar los endpoints.

### 7. **Dockerización**
Aprendí a containerizar mi aplicación con Docker, lo que permite desplegarla fácilmente en cualquier entorno.

## 📁 Estructura del Proyecto

```
PreEntrega_1/
├── app.js                 # Mi servidor principal
├── package.json           # Las dependencias que uso
├── README.md             # Este archivo que estás leyendo 😊
├── test.js               # Para probar que todo funciona
├── Dockerfile            # Configuración de Docker
├── docker-compose.yml    # Orquestación de servicios
├── .dockerignore         # Archivos a ignorar en Docker
├── .gitignore            # Archivos que no quiero subir a GitHub
├── models/
│   ├── User.js           # Cómo se ven mis usuarios
│   └── Pet.js            # Cómo se ven mis mascotas
├── routes/
│   ├── mocks.router.js   # ¡Este es el router principal que me pidieron!
│   ├── users.router.js   # Para manejar usuarios (con Swagger)
│   ├── pets.router.js    # Para manejar mascotas
│   └── adoption.router.js # Sistema completo de adopciones
├── tests/
│   └── adoption.test.js  # Tests funcionales para adopciones
└── utils/
    └── mockingModule.js  # Mi "fábrica" de datos falsos
```

## 🛠️ Cómo instalar y usar el proyecto

### Opción 1: Con Docker (Recomendado) 🐳

#### Usando la Imagen de Docker Hub (Más fácil)
```bash
# Ejecutar directamente desde Docker Hub
docker run -p 8080:8080 tu-usuario-dockerhub/pet-adoption-api:latest

# O con Docker Compose (incluye MongoDB)
git clone <tu-repositorio>
cd PreEntrega_1
docker-compose up -d
```

#### Construir la Imagen Localmente
```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd PreEntrega_1

# Construir la imagen
docker build -t pet-adoption-api .

# Ejecutar con MongoDB externo
docker run -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/pet-adoption-db pet-adoption-api
```

#### Despliegue Automático con GitHub Actions
El proyecto incluye configuración de GitHub Actions para despliegue automático a Docker Hub. Ver [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) para configurar los secretos necesarios.

### Opción 2: Instalación local

#### Paso 1: Instalar dependencias
```bash
npm install
```
Esto descarga todas las librerías que necesito (Express, MongoDB, bcrypt, etc.)

#### Paso 2: Configurar la base de datos
Crea un archivo llamado `.env` en la raíz del proyecto con esto:
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/mocks-db
NODE_ENV=development
```

**Nota importante:** Necesitas tener MongoDB instalado y corriendo en tu computadora. Si no lo tienes, puedes descargarlo de la página oficial.

#### Paso 3: Iniciar el servidor
```bash
npm start
# o para desarrollo (se reinicia automáticamente cuando cambio algo)
npm run dev
```

### Paso 4: ¡Probar que todo funciona!
```bash
# Tests básicos
node test.js

# Tests de adopciones
node tests/adoption.test.js
```

### Paso 5: Ver la documentación de la API
Una vez que el servidor esté corriendo, visita:
- **Swagger UI:** http://localhost:8080/api-docs
- **Health Check:** http://localhost:8080/health

## 🔗 Endpoints que creé

### Router de Mocks (`/api/mocks`) - ¡El principal!

#### 1. **GET** `/api/mocks/mockingpets`
- **¿Qué hace?** Retorna una lista de mascotas de ejemplo
- **¿Por qué?** Este es el endpoint que tuve que migrar del primer desafío
- **Ejemplo de respuesta:**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Buddy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "age": 3
    }
  ]
}
```

#### 2. **GET** `/api/mocks/mockingusers`
- **¿Qué hace?** Genera usuarios falsos usando mi módulo de mocking
- **¿Cuántos?** Por defecto 50, pero puedes cambiar con `?count=10`
- **Características especiales:**
  - Contraseñas siempre encriptadas con "coder123"
  - Roles que alternan entre "user" y "admin"
  - Arrays de mascotas vacíos
  - Nombres y emails generados automáticamente

#### 3. **POST** `/api/mocks/generateData`
- **¿Qué hace?** Genera datos y los guarda en la base de datos MongoDB
- **¿Cómo usarlo?** Envía un JSON con cuántos usuarios y mascotas quieres:
```json
{
  "users": 10,
  "pets": 5
}
```

### Router de Usuarios (`/api/users`) - Para verificar datos

#### 1. **GET** `/api/users`
- **¿Qué hace?** Obtiene todos los usuarios con paginación
- **Parámetros:** `limit`, `page`, `sort`
- **Ejemplo:** `/api/users?limit=5&page=1`

#### 2. **GET** `/api/users/:id`
- **¿Qué hace?** Obtiene un usuario específico por su ID

#### 3. **GET** `/api/users/count/total`
- **¿Qué hace?** Cuenta cuántos usuarios hay en total

### Router de Mascotas (`/api/pets`) - Para verificar datos

#### 1. **GET** `/api/pets`
- **¿Qué hace?** Obtiene todas las mascotas con paginación

#### 2. **GET** `/api/pets/:id`
- **¿Qué hace?** Obtiene una mascota específica por su ID

#### 3. **GET** `/api/pets/count/total`
- **¿Qué hace?** Cuenta cuántas mascotas hay en total

#### 4. **GET** `/api/pets/species/:species`
- **¿Qué hace?** Busca mascotas por especie (perro, gato, etc.)

### Router de Adopciones (`/api/adoption`) - ¡Nuevo! 🐾

#### 1. **GET** `/api/adoption`
- **¿Qué hace?** Obtiene todas las mascotas disponibles para adopción
- **Filtros:** `species`, `age_min`, `age_max`, `limit`, `page`
- **Ejemplo:** `/api/adoption?species=Dog&age_min=1&age_max=5`

#### 2. **GET** `/api/adoption/:id`
- **¿Qué hace?** Obtiene una mascota específica para adopción

#### 3. **POST** `/api/adoption/:petId/adopt`
- **¿Qué hace?** Adopta una mascota
- **Body:** `{ "userId": "id_del_usuario" }`
- **Validaciones:** Previene adopciones duplicadas

#### 4. **PUT** `/api/adoption/:petId/return`
- **¿Qué hace?** Devuelve una mascota (la libera para adopción)
- **Body:** `{ "userId": "id_del_usuario" }`
- **Validaciones:** Solo el dueño puede devolver la mascota

#### 5. **GET** `/api/adoption/user/:userId`
- **¿Qué hace?** Obtiene todas las mascotas adoptadas por un usuario

#### 6. **GET** `/api/adoption/stats/overview`
- **¿Qué hace?** Obtiene estadísticas generales de adopciones
- **Incluye:** Total de mascotas, adoptadas, disponibles, tasa de adopción, estadísticas por especie

## 🎯 Criterios que cumplí

### ✅ **Router de Mocks y Migración**
- Creé el router `mocks.router.js` bajo `/api/mocks`
- Migré exitosamente el endpoint `/mockingpets`

### ✅ **Módulo de Mocking**
- Genera usuarios según un número que le pida
- Contraseñas encriptadas con "coder123"
- Roles que varían entre "user" y "admin"
- Arrays de mascotas vacíos
- Formato compatible con MongoDB

### ✅ **Endpoint GET `/mockingusers`**
- Genera 50 usuarios por defecto
- Usa mi módulo de mocking
- Formato de respuesta como MongoDB

### ✅ **Endpoint POST `/generateData`**
- Recibe parámetros `users` y `pets`
- Genera e inserta en MongoDB
- Manejo de errores incluido

### ✅ **Verificación de Datos**
- Servicios GET de users y pets funcionando
- Puedo verificar que los datos se guardaron
- Paginación y filtros incluidos

### ✅ **Sistema de Adopciones**
- Router completo de adopciones con 6 endpoints
- Validaciones de permisos y duplicados
- Estadísticas y reportes
- Tests funcionales completos

### ✅ **Documentación con Swagger**
- Documentación automática de la API
- Esquemas de datos definidos
- Interfaz web interactiva en `/api-docs`

### ✅ **Dockerización**
- Dockerfile optimizado para producción
- Docker Compose para desarrollo
- Imagen subida a Docker Hub
- Configuración de seguridad incluida

## 🧪 Cómo probar todo

### Opción 1: Usar los archivos de pruebas
```bash
# Tests básicos del sistema
node test.js

# Tests funcionales del sistema de adopciones
node tests/adoption.test.js
```

### Opción 2: Usar Postman o similar
1. **Probar mockingpets:** `GET http://localhost:8080/api/mocks/mockingpets`
2. **Probar mockingusers:** `GET http://localhost:8080/api/mocks/mockingusers?count=5`
3. **Generar datos:** `POST http://localhost:8080/api/mocks/generateData` con body:
```json
{
  "users": 3,
  "pets": 2
}
```
4. **Verificar usuarios:** `GET http://localhost:8080/api/users`
5. **Verificar mascotas:** `GET http://localhost:8080/api/pets`
6. **Probar adopciones:** `GET http://localhost:8080/api/adoption`
7. **Ver documentación:** `GET http://localhost:8080/api-docs`

### Opción 3: Usar la documentación interactiva
Visita http://localhost:8080/api-docs para probar todos los endpoints directamente desde el navegador.

## 🛠️ Tecnologías que usé

- **Express.js** - Para crear el servidor web
- **MongoDB** - Base de datos
- **Mongoose** - Para conectar con MongoDB de forma fácil
- **bcrypt** - Para encriptar contraseñas
- **faker** - Para generar datos falsos realistas
- **cors** - Para permitir peticiones desde otros dominios
- **dotenv** - Para manejar variables de entorno
- **Swagger** - Para documentación automática de la API
- **Docker** - Para containerización
- **Docker Compose** - Para orquestación de servicios

## 🤓 Lo que más me costó

1. **Entender los routers** - Al principio no sabía cómo separar las rutas
2. **Conectar con MongoDB** - Tuve que aprender sobre conexiones y modelos
3. **Encriptar contraseñas** - bcrypt era nuevo para mí
4. **Generar datos realistas** - Quería que se viera bien, no solo datos random
5. **Dockerización** - Configurar Docker correctamente fue un desafío
6. **Swagger** - Aprender la sintaxis de documentación OpenAPI
7. **Tests funcionales** - Crear tests que cubran todos los casos de uso

## 🎉 Lo que más me gustó

- **Ver datos guardándose en MongoDB** - ¡Es súper emocionante!
- **Crear el módulo de mocking** - Es como tener superpoderes para generar datos
- **Organizar mejor mi código** - Ahora se ve más profesional
- **Aprender sobre seguridad** - Encriptar contraseñas es importante
- **Sistema de adopciones** - Crear un flujo completo de negocio
- **Documentación automática** - Swagger hace todo más fácil
- **Docker** - Ver mi app corriendo en un contenedor es genial

## 📚 Lo que aprendí para el futuro

- **Organización de código** - Los routers hacen todo más limpio
- **Bases de datos** - MongoDB es súper útil
- **Seguridad** - Siempre encriptar contraseñas
- **Testing** - Es importante probar que todo funciona
- **Documentación** - Escribir READMEs ayuda mucho
- **Containerización** - Docker facilita el despliegue
- **APIs RESTful** - Diseñar endpoints intuitivos y consistentes
- **Validaciones** - Siempre validar datos de entrada

---

¡Y eso es todo! 🎓 Este proyecto me ayudó mucho a entender mejor cómo funciona el desarrollo backend. Espero que les guste y que cumpla con todos los requisitos de la entrega.

**¡Gracias por leer hasta aquí!** 👨‍💻✨ 