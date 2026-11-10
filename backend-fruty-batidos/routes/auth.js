// routes/auth.js
// Rutas para registrarse e iniciar sesión.

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const config = require("../config");

const router = express.Router();

// POST /api/auth/registro  -> crea un usuario normal (rol "cliente")
router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan datos (nombre, email, password)." });
    }

    const yaExiste = await Usuario.findOne({ email: email.toLowerCase() });
    if (yaExiste) {
      return res.status(400).json({ error: "Ese correo ya está registrado." });
    }

    // Encriptamos la contraseña. El 10 es qué tan "fuerte" se revuelve.
    const passwordEncriptada = await bcrypt.hash(password, 10);

    // Nota: el rol NO lo tomamos del body. Todo el que se registra es "cliente",
    // así nadie puede hacerse admin mandando { rol: "admin" }.
    const usuario = await Usuario.create({ nombre, email, password: passwordEncriptada });

    res.status(201).json({ mensaje: "Usuario creado.", id: usuario._id });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
});

// POST /api/auth/login  -> si los datos son correctos, devuelve un token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos (email, password)." });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    // Mismo mensaje si falla el correo o la clave, para no dar pistas.
    if (!usuario) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // Compara la clave escrita con la encriptada guardada.
    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // Creamos el token con los datos del usuario. Vence en 2 horas.
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol, nombre: usuario.nombre },
      config.jwtSecreto,
      { expiresIn: "2h" }
    );

    res.json({ token, rol: usuario.rol, nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
});

module.exports = router;
