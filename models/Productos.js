const mongoose = require("mongoose");

const ProductosSchema = mongoose.Schema({
  nombre: {
    type: String,
    requerid: true,
    trim: true,
  },
  existencia: {
    type: Number,
    requerid: true,
    trim: true,
  },
  precio: {
    type: Number,
    requerid: true,
    trim: true,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Producto", ProductosSchema);
