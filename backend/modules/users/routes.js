// ==========================================
// MÓDULO USERS - Routes
// ==========================================
// Endpoints:
//   GET    /users      → Listar todos (filtrar con ?rol=cliente)
//   GET    /users/:id  → Obtener uno
//   POST   /users      → Crear usuario
//   PUT    /users/:id  → Actualizar usuario
//   DELETE /users/:id  → Eliminar usuario

const express = require('express');
const router = express.Router();
const userController = require('./controller');

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
