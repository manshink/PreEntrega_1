const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definimos el esquema de usuario - esto es como la "plantilla" de cómo van a ser nuestros usuarios
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true // Esto significa que es obligatorio
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Esto significa que no puede haber dos usuarios con el mismo email
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Solo puede ser 'user' o 'admin'
    default: 'user' // Si no se especifica, será 'user'
  },
  pets: [{
    type: mongoose.Schema.Types.ObjectId, // Esto es el ID de MongoDB
    ref: 'Pet' // Esto hace referencia al modelo Pet
  }],
  createdAt: {
    type: Date,
    default: Date.now // Se crea automáticamente cuando se guarda
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware que se ejecuta ANTES de guardar - esto encripta la contraseña
userSchema.pre('save', async function(next) {
  // Solo encriptamos si la contraseña fue modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Generamos un "salt" (como una especie de condimento para hacer la encriptación más segura)
    const salt = await bcrypt.genSalt(10);
    // Encriptamos la contraseña con el salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Continuamos con el proceso de guardado
  } catch (error) {
    next(error); // Si hay error, lo pasamos al siguiente middleware
  }
});

// Método para comparar contraseñas - esto es útil para el login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Exportamos el modelo - esto es lo que usaremos en otros archivos
module.exports = mongoose.model('User', userSchema); 