// productos.js
// Aquí guardamos SOLO los datos de los productos, separados del servidor.
// Así, si mañana queremos agregar o cambiar un producto, venimos a este
// archivo y no tocamos la lógica del servidor en server.js.

// Un arreglo (array) de objetos. Cada objeto es un producto de Fruty Batidos,
// con id, nombre, precio y descripción.
const productos = [
  {
    id: 1,
    nombre: "Fresas con Crema 12oz",
    precio: 13000,
    descripcion: "Fresas frescas con crema de leche, incluye 2 toppings a elegir."
  },
  {
    id: 2,
    nombre: "Batido de Fresa y Guanábana",
    precio: 11000,
    descripcion: "Batido natural con helado, fresa fresca y guanábana."
  },
  {
    id: 3,
    nombre: "Limonada de Coco",
    precio: 8000,
    descripcion: "Limonada natural mezclada con crema de coco, bien fría."
  }
];

// "module.exports" es como decir: "esto de aquí lo puede usar cualquier
// otro archivo que me pida (con require)". Sin esta línea, el arreglo
// productos se quedaría encerrado en este archivo y server.js no podría verlo.
module.exports = productos;
