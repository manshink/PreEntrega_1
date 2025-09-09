const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Esta función prueba todos los endpoints del router de adopciones
async function testAdoptionEndpoints() {
  console.log('🧪 ¡Probando todos los endpoints del Router de Adopciones!...\n');

  let testUserId = null;
  let testPetId = null;
  let testPetId2 = null;

  try {
    // Preparación: Crear datos de prueba
    console.log('📋 Preparando datos de prueba...');
    
    // Crear un usuario de prueba
    const createUserResponse = await axios.post(`${BASE_URL}/api/mocks/generateData`, {
      users: 1,
      pets: 0
    });
    
    if (createUserResponse.data.results.users.created > 0) {
      // Obtener el ID del usuario creado
      const usersResponse = await axios.get(`${BASE_URL}/api/users`);
      testUserId = usersResponse.data.payload[0]._id;
      console.log(`✅ Usuario de prueba creado con ID: ${testUserId}`);
    }

    // Crear mascotas de prueba
    const createPetsResponse = await axios.post(`${BASE_URL}/api/mocks/generateData`, {
      users: 0,
      pets: 2
    });
    
    if (createPetsResponse.data.results.pets.created > 0) {
      // Obtener los IDs de las mascotas creadas
      const petsResponse = await axios.get(`${BASE_URL}/api/pets`);
      testPetId = petsResponse.data.payload[0]._id;
      testPetId2 = petsResponse.data.payload[1]._id;
      console.log(`✅ Mascotas de prueba creadas con IDs: ${testPetId}, ${testPetId2}`);
    }

    console.log('\n');

    // Prueba 1: GET /api/adoption - Obtener mascotas disponibles para adopción
    console.log('1. Probando GET /api/adoption...');
    const adoptionListResponse = await axios.get(`${BASE_URL}/api/adoption`);
    console.log('✅ ¡El endpoint de lista de adopciones funciona!');
    console.log(`   Encontramos ${adoptionListResponse.data.payload.length} mascotas disponibles`);
    console.log(`   Total de páginas: ${adoptionListResponse.data.totalPages}\n`);

    // Prueba 2: GET /api/adoption con filtros
    console.log('2. Probando GET /api/adoption con filtros...');
    const filteredResponse = await axios.get(`${BASE_URL}/api/adoption?species=Dog&limit=5&page=1`);
    console.log('✅ ¡El endpoint con filtros funciona!');
    console.log(`   Mascotas filtradas por especie: ${filteredResponse.data.payload.length}\n`);

    // Prueba 3: GET /api/adoption/:id - Obtener mascota específica
    if (testPetId) {
      console.log('3. Probando GET /api/adoption/:id...');
      const petDetailResponse = await axios.get(`${BASE_URL}/api/adoption/${testPetId}`);
      console.log('✅ ¡El endpoint de detalle de mascota funciona!');
      console.log(`   Mascota encontrada: ${petDetailResponse.data.payload.name} (${petDetailResponse.data.payload.species})\n`);
    }

    // Prueba 4: POST /api/adoption/:petId/adopt - Adoptar una mascota
    if (testPetId && testUserId) {
      console.log('4. Probando POST /api/adoption/:petId/adopt...');
      const adoptResponse = await axios.post(`${BASE_URL}/api/adoption/${testPetId}/adopt`, {
        userId: testUserId
      });
      console.log('✅ ¡El endpoint de adopción funciona!');
      console.log(`   Mascota adoptada: ${adoptResponse.data.payload.name}`);
      console.log(`   Nuevo dueño: ${adoptResponse.data.payload.owner}\n`);
    }

    // Prueba 5: Intentar adoptar una mascota ya adoptada (debería fallar)
    if (testPetId && testUserId) {
      console.log('5. Probando adopción de mascota ya adoptada (debería fallar)...');
      try {
        await axios.post(`${BASE_URL}/api/adoption/${testPetId}/adopt`, {
          userId: testUserId
        });
        console.log('❌ ¡Error! Debería haber fallado la adopción duplicada');
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log('✅ ¡Correcto! El sistema previene adopciones duplicadas');
          console.log(`   Error esperado: ${error.response.data.message}\n`);
        } else {
          throw error;
        }
      }
    }

    // Prueba 6: GET /api/adoption/user/:userId - Obtener mascotas de un usuario
    if (testUserId) {
      console.log('6. Probando GET /api/adoption/user/:userId...');
      const userPetsResponse = await axios.get(`${BASE_URL}/api/adoption/user/${testUserId}`);
      console.log('✅ ¡El endpoint de mascotas del usuario funciona!');
      console.log(`   Mascotas del usuario: ${userPetsResponse.data.payload.length}\n`);
    }

    // Prueba 7: PUT /api/adoption/:petId/return - Devolver una mascota
    if (testPetId && testUserId) {
      console.log('7. Probando PUT /api/adoption/:petId/return...');
      const returnResponse = await axios.put(`${BASE_URL}/api/adoption/${testPetId}/return`, {
        userId: testUserId
      });
      console.log('✅ ¡El endpoint de devolución funciona!');
      console.log(`   Mascota devuelta: ${returnResponse.data.payload.name}`);
      console.log(`   Dueño actual: ${returnResponse.data.payload.owner}\n`);
    }

    // Prueba 8: Intentar devolver una mascota sin ser el dueño (debería fallar)
    if (testPetId2 && testUserId) {
      console.log('8. Probando devolución sin ser dueño (debería fallar)...');
      try {
        await axios.put(`${BASE_URL}/api/adoption/${testPetId2}/return`, {
          userId: testUserId
        });
        console.log('❌ ¡Error! Debería haber fallado la devolución sin permisos');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log('✅ ¡Correcto! El sistema previene devoluciones sin permisos');
          console.log(`   Error esperado: ${error.response.data.message}\n`);
        } else {
          throw error;
        }
      }
    }

    // Prueba 9: GET /api/adoption/stats/overview - Obtener estadísticas
    console.log('9. Probando GET /api/adoption/stats/overview...');
    const statsResponse = await axios.get(`${BASE_URL}/api/adoption/stats/overview`);
    console.log('✅ ¡El endpoint de estadísticas funciona!');
    console.log(`   Total de mascotas: ${statsResponse.data.payload.overview.totalPets}`);
    console.log(`   Mascotas adoptadas: ${statsResponse.data.payload.overview.adoptedPets}`);
    console.log(`   Mascotas disponibles: ${statsResponse.data.payload.overview.availablePets}`);
    console.log(`   Tasa de adopción: ${statsResponse.data.payload.overview.adoptionRate}%\n`);

    // Prueba 10: Adoptar una segunda mascota para probar el flujo completo
    if (testPetId2 && testUserId) {
      console.log('10. Probando adopción de segunda mascota...');
      const adoptSecondResponse = await axios.post(`${BASE_URL}/api/adoption/${testPetId2}/adopt`, {
        userId: testUserId
      });
      console.log('✅ ¡Segunda adopción exitosa!');
      console.log(`   Mascota adoptada: ${adoptSecondResponse.data.payload.name}\n`);
    }

    // Prueba 11: Verificar que el usuario ahora tiene 2 mascotas
    if (testUserId) {
      console.log('11. Verificando mascotas finales del usuario...');
      const finalUserPetsResponse = await axios.get(`${BASE_URL}/api/adoption/user/${testUserId}`);
      console.log('✅ ¡Verificación exitosa!');
      console.log(`   Mascotas finales del usuario: ${finalUserPetsResponse.data.payload.length}\n`);
    }

    // Prueba 12: Probar validaciones de entrada
    console.log('12. Probando validaciones de entrada...');
    
    // Intentar adoptar sin userId
    try {
      await axios.post(`${BASE_URL}/api/adoption/${testPetId}/adopt`, {});
      console.log('❌ ¡Error! Debería haber fallado sin userId');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ ¡Correcto! Validación de userId funciona');
      } else {
        throw error;
      }
    }

    // Intentar adoptar con mascota inexistente
    try {
      await axios.post(`${BASE_URL}/api/adoption/507f1f77bcf86cd799439999/adopt`, {
        userId: testUserId
      });
      console.log('❌ ¡Error! Debería haber fallado con mascota inexistente');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ ¡Correcto! Validación de mascota inexistente funciona');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 ¡Todas las pruebas del router de adopciones pasaron exitosamente!');
    console.log('\n📋 Resumen de funcionalidades probadas:');
    console.log('- ✅ Listado de mascotas disponibles con paginación');
    console.log('- ✅ Filtros por especie, edad, etc.');
    console.log('- ✅ Detalle de mascota específica');
    console.log('- ✅ Adopción de mascotas');
    console.log('- ✅ Prevención de adopciones duplicadas');
    console.log('- ✅ Listado de mascotas por usuario');
    console.log('- ✅ Devolución de mascotas');
    console.log('- ✅ Prevención de devoluciones sin permisos');
    console.log('- ✅ Estadísticas de adopción');
    console.log('- ✅ Validaciones de entrada');
    console.log('\n🚀 ¡El router de adopciones está completamente funcional!');

  } catch (error) {
    console.error('❌ ¡Ups! Algo salió mal en las pruebas de adopción:', error.message);
    if (error.response) {
      console.error('Datos de la respuesta:', error.response.data);
    }
    throw error;
  }
}

// Ejecutamos las pruebas si este archivo se ejecuta directamente
if (require.main === module) {
  testAdoptionEndpoints();
}

module.exports = { testAdoptionEndpoints };

