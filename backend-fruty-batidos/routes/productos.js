// routes/productos.js
// Rutas de los productos. Ver la lista es público; crear, editar y borrar es solo para admin.

const express = require("express");
const Producto = require("../models/Producto");
const { verificarToken, soloAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/productos -> lista todos (público)
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos." });
  }
});

// POST /api/productos -> crea uno nuevo (solo admin)
router.post("/", verificarToken, soloAdmin, async (req, res) => {
  try {
    // Tomamos solo los campos permitidos, ignorando cualquier otro que manden.
    const { nombre, precio, descripcion } = req.body;
    const producto = await Producto.create({ nombre, precio, descripcion });
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: "Datos inválidos. Revisa nombre y precio." });
  }
});

// PUT /api/productos/:id -> edita uno (solo admin)
router.put("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, precio, descripcion },
      { new: true, runValidators: true } // new: devuelve el ya editado
    );
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: "Id o datos inválidos." });
  }
});

// DELETE /api/productos/:id -> borra uno (solo admin)
router.delete("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json({ mensaje: "Producto eliminado." });
  } catch (error) {
    res.status(400).json({ error: "Id inválido." });
  }
});

module.exports = router;
