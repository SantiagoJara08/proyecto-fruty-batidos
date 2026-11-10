
// Crea el primer usuario administrador. Se corre así (con tus datos):
//   node crearAdmin.js "Tu Nombre" tucorreo@gmail.com tuClaveSegura
// Así la clave del admin no queda escrita en ningún archivo del proyecto.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("./config");
const Usuario = require("./models/Usuario");

const [nombre, email, password] = process.argv.slice(2);

async function crear() {
  if (!nombre || !email || !password) {
    console.log('Uso: node crearAdmin.js "Nombre" correo clave');
    return;
  }

  await mongoose.connect(config.mongoUri);

  const yaExiste = await Usuario.findOne({ email: email.toLowerCase() });
  if (yaExiste) {
    console.log("Ese correo ya existe.");
  } else {
    const passwordEncriptada = await bcrypt.hash(password, 10);
    await Usuario.create({ nombre, email, password: passwordEncriptada, rol: "admin" });
    console.log("Administrador creado.");
  }

  await mongoose.disconnect();
}

crear().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
