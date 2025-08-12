const bcrypt = require('bcrypt');
const faker = require('faker');

class MockingModule {
  static async generateUsers(count = 1) {
    const users = [];
    
    for (let i = 0; i < count; i++) {
      const user = {
        _id: faker.datatype.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('coder123', 10),
        role: Math.random() > 0.5 ? 'user' : 'admin',
        pets: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      };
      
      users.push(user);
    }
    
    return users;
  }

  static generatePets(count = 1) {
    const pets = [];
    const species = ['Dog', 'Cat', 'Bird', 'Fish', 'Hamster', 'Rabbit'];
    const dogBreeds = ['Labrador', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle'];
    const catBreeds = ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'];
    const birdBreeds = ['Parakeet', 'Cockatiel', 'Canary', 'Finch', 'Lovebird'];
    const fishBreeds = ['Goldfish', 'Betta', 'Guppy', 'Tetra', 'Angelfish'];
    const hamsterBreeds = ['Syrian', 'Dwarf', 'Roborovski', 'Campbell', 'Winter White'];
    const rabbitBreeds = ['Holland Lop', 'Netherland Dwarf', 'Rex', 'Angora', 'Lionhead'];

    for (let i = 0; i < count; i++) {
      const speciesType = species[Math.floor(Math.random() * species.length)];
      let breed;
      
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
          breed = 'Mixed';
      }

      const pet = {
        _id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        species: speciesType,
        breed: breed,
        age: Math.floor(Math.random() * 15) + 1,
        owner: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      };
      
      pets.push(pet);
    }
    
    return pets;
  }
}

module.exports = MockingModule; 