// ==========================================
// MÓDULO IA - Routes
// ==========================================
// Endpoints:
//   POST /ai/analyze → Analizar texto con IA
//     Body: { "text": "texto a analizar", "type": "sentiment|keywords|summary|general" }

const express = require('express');
const router = express.Router();
const iaController = require('./controller');

router.post('/analyze', iaController.analyze);

module.exports = router;
