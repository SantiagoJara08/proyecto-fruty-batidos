// config.example.js
// Este archivo es una PLANTILLA y sí se sube a GitHub (no tiene datos reales).
// Cópialo con el nombre config.js y llena tus datos reales ahí.
// config.js NO se sube a GitHub porque está en el .gitignore.

module.exports = {
  // La dirección de conexión que te da MongoDB Atlas (botón "Connect" > "Drivers").
  // Reemplaza USUARIO, CLAVE y el nombre del cluster por los tuyos.
  mongoUri: "mongodb+srv://USUARIO:CLAVE@cluster0.xxxxx.mongodb.net/frutybatidos?retryWrites=true&w=majority",

  // Frase secreta para firmar los tokens de login. Escribe una larga y rara.
  jwtSecreto: "escribe_aqui_una_frase_larga_y_secreta",

  // Puerto donde corre el servidor.
  puerto: 3000
};
