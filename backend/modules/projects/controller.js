// ==========================================
// MÓDULO PROJECTS - Controller
// ==========================================
// CRUD de proyectos con control de acceso por rol.

const { db } = require('../../models/models');

const projectController = {
    // GET /projects/:userId → Obtener proyectos según rol
    getByUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const userRef = db.collection('usuarios').doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) return res.status(404).json({ success: false, message: req.t ? req.t('users.notFound') : 'Usuario no encontrado' });

            const userData = userDoc.data();
            let proyectosQuery = db.collection('proyectos');
            
            if (userData.rol !== 'admin' && userData.rol !== 'moderador') {
                proyectosQuery = proyectosQuery.where('clienteId', '==', userId);
            }
            
            const snapshot = await proyectosQuery.get();
            const proyectos = [];
            
            for (const doc of snapshot.docs) {
                const data = doc.data();
                const proyecto = { ...data, id: doc.id };
                
                // Hidratar cliente
                if (data.clienteId) {
                    const clienteDoc = await db.collection('usuarios').doc(data.clienteId).get();
                    if (clienteDoc.exists) {
                        proyecto.cliente = { ...clienteDoc.data(), id: clienteDoc.id };
                    }
                }
                
                // Obtener pagos
                const pagosSnap = await db.collection(`proyectos/${doc.id}/pagos`).get();
                proyecto.Pagos = pagosSnap.docs.map(p => ({ id: p.id, ...p.data() }));
                
                // Obtener comentarios
                const comSnap = await db.collection(`proyectos/${doc.id}/comentarios`).get();
                const comentarios = [];
                for (const c of comSnap.docs) {
                    const cData = c.data();
                    const comObj = { ...cData, id: c.id };
                    if (cData.usuarioId) {
                        const uDoc = await db.collection('usuarios').doc(cData.usuarioId).get();
                        if (uDoc.exists) comObj.Usuario = { ...uDoc.data(), id: uDoc.id };
                    }
                    comentarios.push(comObj);
                }
                proyecto.Comentarios = comentarios;
                
                proyectos.push(proyecto);
            }
            res.json(proyectos);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /projects → Crear proyecto (solo admin)
    create: async (req, res) => {
        try {
            const docRef = db.collection('proyectos').doc();
            const data = { ...req.body, fechaInicio: new Date().toISOString() };
            await docRef.set(data);
            res.json({
                success: true,
                message: req.t ? req.t('projects.createSuccess') : 'Proyecto creado exitosamente',
                proyecto: { id: docRef.id, ...data }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /projects/:id → Actualizar proyecto (solo admin/mod)
    update: async (req, res) => {
        try {
            const docRef = db.collection('proyectos').doc(req.params.id);
            const doc = await docRef.get();
            if (!doc.exists) return res.status(404).json({ success: false, message: req.t ? req.t('projects.notFound') : 'Proyecto no encontrado' });
            
            await docRef.update(req.body);
            res.json({
                success: true,
                message: req.t ? req.t('projects.updateSuccess') : 'Proyecto actualizado',
                proyecto: { id: doc.id, ...doc.data(), ...req.body }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /projects/:id → Eliminar proyecto (solo admin)
    delete: async (req, res) => {
        try {
            const docRef = db.collection('proyectos').doc(req.params.id);
            const doc = await docRef.get();
            if (!doc.exists) return res.status(404).json({ success: false, message: req.t ? req.t('projects.notFound') : 'Proyecto no encontrado' });
            await docRef.delete();
            res.json({
                success: true,
                message: req.t ? req.t('projects.deleteSuccess') : 'Proyecto eliminado'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /projects/:id/comments → Añadir comentario (cliente/admin)
    addComment: async (req, res) => {
        try {
            const { texto, actitud, usuarioId } = req.body;
            const proyectoId = req.params.id;

            const proyectoRef = db.collection('proyectos').doc(proyectoId);
            const pDoc = await proyectoRef.get();
            if (!pDoc.exists) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });

            const comentarioRef = db.collection(`proyectos/${proyectoId}/comentarios`).doc();
            const data = { texto, actitud, usuarioId, fecha: new Date().toISOString() };
            await comentarioRef.set(data);

            res.json({
                success: true,
                message: 'Comentario agregado',
                comentario: { id: comentarioRef.id, ...data }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = projectController;
