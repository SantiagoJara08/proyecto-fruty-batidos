// models/Usuario.js
// Cómo es un usuario guardado en la base de datos.

const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true }, // no se puede repetir
  password: { type: String, required: true }, // aquí se guarda ENCRIPTADA, nunca en texto normal
  rol: { type: String, enum: ["admin", "cliente"], default: "cliente" } // solo permite estos dos valores
});

module.exports = mongoose.model("Usuario", usuarioSchema);
