// middleware/auth.js
// Un "middleware" es una función que se ejecuta ANTES de la ruta, como un portero:
// revisa algo y decide si deja pasar (next) o frena la petición.

const jwt = require("jsonwebtoken");
const config = require("../config");

// Portero 1: revisa que la petición traiga un token de login válido.
function verificarToken(req, res, next) {
  // El token llega en la cabecera así:  Authorization: Bearer <token>
  const cabecera = req.headers.authorization;
  if (!cabecera) {
    return res.status(401).json({ error: "Falta el token. Inicia sesión." });
  }

  const token = cabecera.split(" ")[1]; // nos quedamos solo con la parte del token

  try {
    // Si el token es falso o está vencido, verify lanza un error.
    req.usuario = jwt.verify(token, config.jwtSecreto); // guardamos quién es el usuario
    next(); // todo bien, pasa a la ruta
  } catch (error) {
    res.status(401).json({ error: "Token inválido o vencido." });
  }
}

// Portero 2: deja pasar solo si el usuario tiene rol "admin".
// Se usa DESPUÉS de verificarToken.
function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "Solo para administradores." });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
