// ==========================================
// MÓDULO GEO - Routes
// ==========================================
// Endpoints:
//   GET    /locations      → Listar todas (filtrar con ?tipo=oficina)
//   GET    /locations/:id  → Obtener una
//   POST   /locations      → Crear ubicación
//   PUT    /locations/:id  → Actualizar ubicación
//   DELETE /locations/:id  → Eliminar ubicación

const express = require('express');
const router = express.Router();
const geoController = require('./controller');

router.get('/', geoController.getAll);
router.get('/:id', geoController.getById);
router.post('/', geoController.create);
router.put('/:id', geoController.update);
router.delete('/:id', geoController.delete);

module.exports = router;
