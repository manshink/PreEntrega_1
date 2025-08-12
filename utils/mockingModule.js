const bcrypt = require('bcrypt');
const faker = require('faker');

// Esta clase es para generar datos falsos (mocks) - muy útil para testing y desarrollo
class MockingModule {
  // Método estático para generar usuarios falsos
  static async generateUsers(count = 1) {
    const users = []; // Array donde vamos a guardar todos los usuarios
    
    // Generamos la cantidad de usuarios que nos pidan
    for (let i = 0; i < count; i++) {
      const user = {
        _id: faker.datatype.uuid(), // Generamos un ID único
        first_name: faker.name.firstName(), // Nombre aleatorio
        last_name: faker.name.lastName(), // Apellido aleatorio
        email: faker.internet.email(), // Email aleatorio
        password: await bcrypt.hash('coder123', 10), // Siempre la misma contraseña encriptada
        role: Math.random() > 0.5 ? 'user' : 'admin', // 50% de probabilidad de ser user o admin
        pets: [], // Array vacío de mascotas
        createdAt: faker.date.past(), // Fecha de creación aleatoria en el pasado
        updatedAt: faker.date.recent() // Fecha de actualización reciente
      };
      
      users.push(user); // Agregamos el usuario al array
    }
    
    return users; // Retornamos todos los usuarios generados
  }

  // Método estático para generar mascotas falsas
  static generatePets(count = 1) {
    const pets = []; // Array para las mascotas
    
    // Definimos las especies disponibles
    const species = ['Dog', 'Cat', 'Bird', 'Fish', 'Hamster', 'Rabbit'];
    
    // Definimos las razas para cada especie - esto hace que sea más realista
    const dogBreeds = ['Labrador', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle'];
    const catBreeds = ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'];
    const birdBreeds = ['Parakeet', 'Cockatiel', 'Canary', 'Finch', 'Lovebird'];
    const fishBreeds = ['Goldfish', 'Betta', 'Guppy', 'Tetra', 'Angelfish'];
    const hamsterBreeds = ['Syrian', 'Dwarf', 'Roborovski', 'Campbell', 'Winter White'];
    const rabbitBreeds = ['Holland Lop', 'Netherland Dwarf', 'Rex', 'Angora', 'Lionhead'];

    // Generamos la cantidad de mascotas que nos pidan
    for (let i = 0; i < count; i++) {
      // Elegimos una especie aleatoria
      const speciesType = species[Math.floor(Math.random() * species.length)];
      let breed; // Variable para la raza
      
      // Según la especie, elegimos una raza apropiada
      switch (speciesType) {
        case 'Dog':
          breed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
          break;
        case 'Cat':
          breed = catBreeds[Math.floor(Math.random() * catBreeds.length)];
          break;
        case 'Bird':
          breed = birdBreeds[Math.floor(Math.random() * birdBreeds.length)];
          break;
        case 'Fish':
          breed = fishBreeds[Math.floor(Math.random() * fishBreeds.length)];
          break;
        case 'Hamster':
          breed = hamsterBreeds[Math.floor(Math.random() * hamsterBreeds.length)];
          break;
        case 'Rabbit':
          breed = rabbitBreeds[Math.floor(Math.random() * rabbitBreeds.length)];
          break;
        default:
          breed = 'Mixed'; // Si no coincide con nada, es mixto
      }

      // Creamos el objeto mascota
      const pet = {
        _id: faker.datatype.uuid(), // ID único
        name: faker.name.firstName(), // Nombre aleatorio (usamos firstName para mascotas también)
        species: speciesType, // La especie que elegimos
        breed: breed, // La raza que elegimos
        age: Math.floor(Math.random() * 15) + 1, // Edad entre 1 y 15 años
        owner: null, // Por ahora no tiene dueño
        createdAt: faker.date.past(), // Fecha de creación aleatoria
        updatedAt: faker.date.recent() // Fecha de actualización reciente
      };
      
      pets.push(pet); // Agregamos la mascota al array
    }
    
    return pets; // Retornamos todas las mascotas generadas
  }
}

// Exportamos la clase para usarla en otros archivos
module.exports = MockingModule; 