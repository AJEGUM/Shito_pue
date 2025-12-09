const express = require("express");
const ProductosController = require("../controllers/producto.controller");
const authAdmin = require('../middlewares/auth');
const router = express.Router();
const controller = new ProductosController();

// RUTAS PUBLICAS
router.get("/publicos/lista", (req, res) => controller.obtenerProductos(req, res));

// Middleware + controlador CORRECTO
router.get("/", authAdmin, (req, res) => controller.obtenerProductos(req, res));
router.post("/", authAdmin, (req, res) => controller.crearProducto(req, res));
router.put("/:id", authAdmin, (req, res) => controller.actualizarProducto(req, res));
router.delete("/:id", authAdmin, (req, res) => controller.eliminarProducto(req, res));

module.exports = router;
