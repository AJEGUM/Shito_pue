const express = require("express");
const UsuariosController = require("../controllers/usuarios.controller");

const router = express.Router();
const controller = new UsuariosController();

router.get("/", (req, res) => controller.obtenerUsuarios(req, res));
router.post("/", (req, res) => controller.crearUsuario(req, res));
router.get("/:id", (req, res) => controller.obtenerUsuario(req, res));
router.put("/:id", (req, res) => controller.actualizarUsuario(req, res));
router.delete("/:id", (req, res) => controller.eliminarUsuario(req, res));

module.exports = router;
