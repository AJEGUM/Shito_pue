const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const ProductosController = require("../controllers/imagenes.controller");
const controller = new ProductosController();

// Obtener productos
router.get("/", controller.obtenerProductos);

// Crear producto (con imagen)
router.post("/", upload.single("imagen_producto"), controller.crearProducto);

// Actualizar producto (con imagen opcional)
router.put("/:id", upload.single("imagen_producto"), controller.actualizarProducto);

// Eliminar producto
router.delete("/:id", controller.eliminarProducto);

module.exports = router;
