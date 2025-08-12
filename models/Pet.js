const mongoose = require('mongoose');

// Definimos el esquema de mascota - similar al de usuario pero más simple
const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // El nombre es obligatorio
  },
  species: {
    type: String,
    required: true // La especie también es obligatoria (perro, gato, etc.)
  },
  breed: {
    type: String,
    required: true // La raza también es obligatoria
  },
  age: {
    type: Number,
    required: true,
    min: 0 // La edad no puede ser negativa
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // ID del dueño
    ref: 'User' // Hace referencia al modelo User
  },
  createdAt: {
    type: Date,
    default: Date.now // Se crea automáticamente
  },
  updatedAt: {
    type: Date,
    default: Date.now // Se actualiza automáticamente
  }
});

// Exportamos el modelo de mascota
module.exports = mongoose.model('Pet', petSchema); 