// ==========================================
// MÓDULO AUTH - Routes
// ==========================================
// Endpoints:
//   POST /auth/login     → Iniciar sesión
//   POST /auth/register  → Registrar usuario

const express = require('express');
const router = express.Router();
const authController = require('./controller');

// Rutas públicas (no requieren token)
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
