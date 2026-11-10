// models/Producto.js
// Un "modelo" le dice a MongoDB cómo es un producto: qué campos tiene y de qué tipo.

const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },       // obligatorio
  precio: { type: Number, required: true, min: 0 }, // obligatorio, no negativo
  descripcion: { type: String, default: "" }       // opcional
});

// MongoDB le pone solo un campo "_id" único a cada producto (reemplaza el "id" que teníamos).
module.exports = mongoose.model("Producto", productoSchema);
