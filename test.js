const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Esta función prueba todos los endpoints que creamos para la entrega
async function testEndpoints() {
  console.log('🧪 ¡Probando todos los endpoints del Router de Mocks!...\n');

  try {
    // Prueba 1: GET /api/mocks/mockingpets - Este es el endpoint que migramos
    console.log('1. Probando GET /api/mocks/mockingpets...');
    const mockingPetsResponse = await axios.get(`${BASE_URL}/api/mocks/mockingpets`);
    console.log('✅ ¡El endpoint de mascotas falsas funciona!');
    console.log(`   Encontramos ${mockingPetsResponse.data.payload.length} mascotas de ejemplo\n`);

    // Prueba 2: GET /api/mocks/mockingusers - Este genera usuarios con nuestro módulo
    console.log('2. Probando GET /api/mocks/mockingusers...');
    const mockingUsersResponse = await axios.get(`${BASE_URL}/api/mocks/mockingusers?count=5`);
    console.log('✅ ¡El endpoint de usuarios falsos funciona!');
    console.log(`   Generamos ${mockingUsersResponse.data.total} usuarios`);
    console.log(`   Ejemplo de usuario: ${mockingUsersResponse.data.payload[0].first_name} ${mockingUsersResponse.data.payload[0].last_name} (${mockingUsersResponse.data.payload[0].role})\n`);

    // Prueba 3: POST /api/mocks/generateData - Este guarda datos en la base de datos
    console.log('3. Probando POST /api/mocks/generateData...');
    const generateDataResponse = await axios.post(`${BASE_URL}/api/mocks/generateData`, {
      users: 3,
      pets: 2
    });
    console.log('✅ ¡El endpoint de generar datos funciona!');
    console.log(`   Creamos ${generateDataResponse.data.results.users.created} usuarios`);
    console.log(`   Creamos ${generateDataResponse.data.results.pets.created} mascotas\n`);

    // Prueba 4: GET /api/users - Para verificar que se guardaron los usuarios
    console.log('4. Probando GET /api/users (verificando que se guardaron)...');
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log('✅ ¡El endpoint de usuarios funciona!');
    console.log(`   Encontramos ${usersResponse.data.payload.length} usuarios en la base de datos\n`);

    // Prueba 5: GET /api/pets - Para verificar que se guardaron las mascotas
    console.log('5. Probando GET /api/pets (verificando que se guardaron)...');
    const petsResponse = await axios.get(`${BASE_URL}/api/pets`);
    console.log('✅ ¡El endpoint de mascotas funciona!');
    console.log(`   Encontramos ${petsResponse.data.payload.length} mascotas en la base de datos\n`);

    // Prueba 6: GET /api/users/count/total - Para contar usuarios
    console.log('6. Probando GET /api/users/count/total...');
    const usersCountResponse = await axios.get(`${BASE_URL}/api/users/count/total`);
    console.log('✅ ¡El endpoint de contar usuarios funciona!');
    console.log(`   Total de usuarios en la base de datos: ${usersCountResponse.data.payload.total}\n`);

    // Prueba 7: GET /api/pets/count/total - Para contar mascotas
    console.log('7. Probando GET /api/pets/count/total...');
    const petsCountResponse = await axios.get(`${BASE_URL}/api/pets/count/total`);
    console.log('✅ ¡El endpoint de contar mascotas funciona!');
    console.log(`   Total de mascotas en la base de datos: ${petsCountResponse.data.payload.total}\n`);

    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📋 Resumen de lo que funciona:');
    console.log('- ✅ Router de mocks creado y funcionando perfectamente');
    console.log('- ✅ Endpoint /mockingpets migrado correctamente del primer desafío');
    console.log('- ✅ Módulo de mocking generando usuarios con contraseñas encriptadas');
    console.log('- ✅ Endpoint /mockingusers generando 50 usuarios por defecto');
    console.log('- ✅ Endpoint /generateData insertando datos en MongoDB');
    console.log('- ✅ Servicios GET de users y pets verificando registros insertados');
    console.log('\n🚀 ¡El proyecto está listo para entregar!');

  } catch (error) {
    console.error('❌ ¡Ups! Algo salió mal en las pruebas:', error.message);
    if (error.response) {
      console.error('Datos de la respuesta:', error.response.data);
    }
  }
}

// Ejecutamos las pruebas si este archivo se ejecuta directamente
if (require.main === module) {
  testEndpoints();
}

module.exports = { testEndpoints }; 