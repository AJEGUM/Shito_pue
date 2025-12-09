const express = require("express");
const VentasController = require("../controllers/ventas.controller");

const router = express.Router();
const controller = new VentasController();

router.get("/", (req, res) => controller.obtenerVentas(req, res));
router.post("/", (req, res) => controller.crearVenta(req, res));
router.get("/:id_venta/detalle", (req, res) => controller.obtenerDetalle(req, res));

module.exports = router;
