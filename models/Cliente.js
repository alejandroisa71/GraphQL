const mongoose = require("mongoose");

const ClientesSchema = mongoose.Schema({
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
  empresa: {
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
  telefono: {
    type: String,
    trim: true,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    requerid: true,
    ref: "Usuario",
  },
});

module.exports = mongoose.model("Cliente", ClientesSchema);
