const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Función para verificar que todos los endpoints funcionan
async function verifyDeployment() {
  console.log('🔍 Verificando despliegue completo...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: '/health',
      method: 'GET'
    },
    {
      name: 'Swagger Documentation',
      url: '/api-docs',
      method: 'GET'
    },
    {
      name: 'Mocks - Mocking Pets',
      url: '/api/mocks/mockingpets',
      method: 'GET'
    },
    {
      name: 'Mocks - Mocking Users',
      url: '/api/mocks/mockingusers?count=3',
      method: 'GET'
    },
    {
      name: 'Users - List',
      url: '/api/users',
      method: 'GET'
    },
    {
      name: 'Users - Count',
      url: '/api/users/count/total',
      method: 'GET'
    },
    {
      name: 'Pets - List',
      url: '/api/pets',
      method: 'GET'
    },
    {
      name: 'Pets - Count',
      url: '/api/pets/count/total',
      method: 'GET'
    },
    {
      name: 'Adoption - List',
      url: '/api/adoption',
      method: 'GET'
    },
    {
      name: 'Adoption - Stats',
      url: '/api/adoption/stats/overview',
      method: 'GET'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        timeout: 5000
      });
      
      console.log(`✅ ${test.name}: ${response.status} - OK`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resumen: ${passed} pasaron, ${failed} fallaron`);
  
  if (failed === 0) {
    console.log('🎉 ¡Todos los endpoints funcionan correctamente!');
    console.log('✅ El proyecto está listo para la entrega');
  } else {
    console.log('⚠️  Algunos endpoints fallaron. Revisa la configuración.');
  }

  console.log('\n🔗 Enlaces importantes:');
  console.log(`- Health Check: ${BASE_URL}/health`);
  console.log(`- Swagger UI: ${BASE_URL}/api-docs`);
  console.log(`- API Base: ${BASE_URL}/api`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  verifyDeployment();
}

module.exports = { verifyDeployment };
