const { testEndpoints } = require('./test');
const { testAdoptionEndpoints } = require('./tests/adoption.test');

// Función para ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 ¡Iniciando suite completa de tests!...\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Tests básicos del sistema
    console.log('\n📋 EJECUTANDO TESTS BÁSICOS DEL SISTEMA');
    console.log('=' .repeat(60));
    await testEndpoints();
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ Tests básicos completados exitosamente\n');
    
    // Esperar un poco entre tests
    console.log('⏳ Esperando 2 segundos antes de continuar...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Tests del sistema de adopciones
    console.log('📋 EJECUTANDO TESTS DEL SISTEMA DE ADOPCIONES');
    console.log('=' .repeat(60));
    await testAdoptionEndpoints();
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ Tests de adopciones completados exitosamente\n');
    
    // Resumen final
    console.log('🎉 ¡TODOS LOS TESTS COMPLETADOS EXITOSAMENTE!');
    console.log('=' .repeat(60));
    console.log('📊 Resumen de funcionalidades probadas:');
    console.log('✅ Router de mocks (3 endpoints)');
    console.log('✅ Router de usuarios (3 endpoints)');
    console.log('✅ Router de mascotas (4 endpoints)');
    console.log('✅ Router de adopciones (6 endpoints)');
    console.log('✅ Documentación con Swagger');
    console.log('✅ Validaciones y manejo de errores');
    console.log('✅ Tests funcionales completos');
    console.log('\n🚀 ¡El proyecto está listo para producción!');
    
  } catch (error) {
    console.error('\n❌ ¡Error en la suite de tests!');
    console.error('Detalles del error:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };

