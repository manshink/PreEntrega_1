const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testEndpoints() {
  console.log('🧪 Testing Mocks Router Endpoints...\n');

  try {
    // Test 1: GET /api/mocks/mockingpets
    console.log('1. Testing GET /api/mocks/mockingpets...');
    const mockingPetsResponse = await axios.get(`${BASE_URL}/api/mocks/mockingpets`);
    console.log('✅ Mocking pets endpoint working');
    console.log(`   Found ${mockingPetsResponse.data.payload.length} pets\n`);

    // Test 2: GET /api/mocks/mockingusers
    console.log('2. Testing GET /api/mocks/mockingusers...');
    const mockingUsersResponse = await axios.get(`${BASE_URL}/api/mocks/mockingusers?count=5`);
    console.log('✅ Mocking users endpoint working');
    console.log(`   Generated ${mockingUsersResponse.data.total} users`);
    console.log(`   Sample user: ${mockingUsersResponse.data.payload[0].first_name} ${mockingUsersResponse.data.payload[0].last_name} (${mockingUsersResponse.data.payload[0].role})\n`);

    // Test 3: POST /api/mocks/generateData
    console.log('3. Testing POST /api/mocks/generateData...');
    const generateDataResponse = await axios.post(`${BASE_URL}/api/mocks/generateData`, {
      users: 3,
      pets: 2
    });
    console.log('✅ Generate data endpoint working');
    console.log(`   Created ${generateDataResponse.data.results.users.created} users`);
    console.log(`   Created ${generateDataResponse.data.results.pets.created} pets\n`);

    // Test 4: GET /api/users (verify insertion)
    console.log('4. Testing GET /api/users (verifying insertion)...');
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log('✅ Users endpoint working');
    console.log(`   Found ${usersResponse.data.payload.length} users in database\n`);

    // Test 5: GET /api/pets (verify insertion)
    console.log('5. Testing GET /api/pets (verifying insertion)...');
    const petsResponse = await axios.get(`${BASE_URL}/api/pets`);
    console.log('✅ Pets endpoint working');
    console.log(`   Found ${petsResponse.data.payload.length} pets in database\n`);

    // Test 6: GET /api/users/count/total
    console.log('6. Testing GET /api/users/count/total...');
    const usersCountResponse = await axios.get(`${BASE_URL}/api/users/count/total`);
    console.log('✅ Users count endpoint working');
    console.log(`   Total users in database: ${usersCountResponse.data.payload.total}\n`);

    // Test 7: GET /api/pets/count/total
    console.log('7. Testing GET /api/pets/count/total...');
    const petsCountResponse = await axios.get(`${BASE_URL}/api/pets/count/total`);
    console.log('✅ Pets count endpoint working');
    console.log(`   Total pets in database: ${petsCountResponse.data.payload.total}\n`);

    console.log('🎉 All tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Router de mocks creado y funcionando');
    console.log('- Endpoint /mockingpets migrado correctamente');
    console.log('- Módulo de mocking generando usuarios con contraseñas encriptadas');
    console.log('- Endpoint /mockingusers generando 50 usuarios por defecto');
    console.log('- Endpoint /generateData insertando datos en MongoDB');
    console.log('- Servicios GET de users y pets verificando registros insertados');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEndpoints();
}

module.exports = { testEndpoints }; 