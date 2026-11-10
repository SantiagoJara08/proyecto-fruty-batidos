// server.js
// Archivo principal: conecta con la base de datos, registra las rutas y enciende el servidor.

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");
const rutasProductos = require("./routes/productos");
const rutasAuth = require("./routes/auth");

const app = express();

// cors permite que tu página (en GitHub Pages) pueda pedirle datos a este servidor.
app.use(cors());
// express.json permite leer el JSON que llega en el body de las peticiones.
app.use(express.json());

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor de Fruty Batidos! 🍓🍧");
});

// Todas las rutas de productos empiezan con /api/productos
app.use("/api/productos", rutasProductos);
// Todas las rutas de login/registro empiezan con /api/auth
app.use("/api/auth", rutasAuth);

// Primero nos conectamos a MongoDB; SOLO si funciona, encendemos el servidor.
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(config.puerto, () => {
      console.log(`Servidor corriendo en http://localhost:${config.puerto}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo conectar a MongoDB:", error.message);
  });
