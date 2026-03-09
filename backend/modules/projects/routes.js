// ==========================================
// MÓDULO PROJECTS - Routes
// ==========================================
const express = require('express');
const router = express.Router();
const projectController = require('./controller');

router.get('/:userId', projectController.getByUser);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);
router.post('/:id/comments', projectController.addComment);

module.exports = router;
