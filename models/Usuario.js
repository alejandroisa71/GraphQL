const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
  nombre: {
    type: String,
    requerid: true,
    trim: true,
  },
  apellido: {
    type: String,
    requerid: true,
    trim: true,
  },
  email: {
    type: String,
    requerid: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    requerid: true,
    trim: true,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Usuario", UsuariosSchema);
