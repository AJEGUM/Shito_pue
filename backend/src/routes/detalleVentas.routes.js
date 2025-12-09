const express = require("express");
const DetalleVentasController = require("../controllers/detalleVentas.controller");

const router = express.Router();
const controller = new DetalleVentasController();

router.get("/", (req, res) => controller.obtenerDetalles(req, res));

module.exports = router;
