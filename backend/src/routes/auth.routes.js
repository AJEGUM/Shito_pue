const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registro
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Obtener usuarios (solo admins) — protegido
router.get('/users', authController.getUsers);

module.exports = router;
