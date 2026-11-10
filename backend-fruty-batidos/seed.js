// seed.js
// Se corre UNA vez con:  node seed.js
// Pasa los productos de productos.js a la base de datos (solo si está vacía).

const mongoose = require("mongoose");
const config = require("./config");
const Producto = require("./models/Producto");
const productos = require("./productos");

async function cargar() {
  await mongoose.connect(config.mongoUri);

  const cantidad = await Producto.countDocuments();
  if (cantidad > 0) {
    console.log("La base de datos ya tiene productos. No se cargó nada.");
  } else {
    // Quitamos el "id" viejo porque MongoDB crea su propio _id.
    const sinId = productos.map(({ nombre, precio, descripcion }) => ({ nombre, precio, descripcion }));
    await Producto.insertMany(sinId);
    console.log("Productos cargados en la base de datos.");
  }

  await mongoose.disconnect();
}

cargar().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
