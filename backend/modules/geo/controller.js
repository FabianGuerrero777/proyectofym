// ==========================================
// MÓDULO GEO - Controller
// ==========================================
// Lógica de negocio para gestión de ubicaciones geográficas

const { db } = require('../../models/models');

const geoController = {
    // GET /locations → Listar todas las ubicaciones
    getAll: async (req, res) => {
        try {
            let locationsRef = db.collection('locations');
            if (req.query.tipo) {
                locationsRef = locationsRef.where('tipo', '==', req.query.tipo);
            }

            const snapshot = await locationsRef.get();
            const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.json({
                success: true,
                message: req.t('locations.listSuccess'),
                data: locations
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /locations/:id → Obtener una ubicación por ID
    getById: async (req, res) => {
        try {
            const doc = await db.collection('locations').doc(req.params.id).get();
            if (!doc.exists) {
                return res.status(404).json({
                    success: false,
                    message: req.t('locations.notFound')
                });
            }

            res.json({ success: true, data: { id: doc.id, ...doc.data() } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /locations → Crear nueva ubicación
    create: async (req, res) => {
        try {
            const { nombre, direccion, latitud, longitud, tipo, descripcion } = req.body;

            if (!nombre || latitud === undefined || longitud === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere: nombre, latitud, longitud'
                });
            }

            const docRef = db.collection('locations').doc();
            const locationData = {
                nombre, direccion, latitud, longitud,
                tipo: tipo || 'otro',
                descripcion,
                createdAt: new Date().toISOString()
            };
            await docRef.set(locationData);

            res.status(201).json({
                success: true,
                message: req.t('locations.createSuccess'),
                data: { id: docRef.id, ...locationData }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /locations/:id → Actualizar ubicación
    update: async (req, res) => {
        try {
            const docRef = db.collection('locations').doc(req.params.id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({
                    success: false,
                    message: req.t('locations.notFound')
                });
            }

            const updateData = {};
            if (req.body.nombre) updateData.nombre = req.body.nombre;
            if (req.body.direccion) updateData.direccion = req.body.direccion;
            if (req.body.latitud !== undefined) updateData.latitud = req.body.latitud;
            if (req.body.longitud !== undefined) updateData.longitud = req.body.longitud;
            if (req.body.tipo) updateData.tipo = req.body.tipo;
            if (req.body.descripcion) updateData.descripcion = req.body.descripcion;

            await docRef.update(updateData);

            res.json({
                success: true,
                message: req.t('locations.updateSuccess'),
                data: { id: doc.id, ...doc.data(), ...updateData }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /locations/:id → Eliminar ubicación
    delete: async (req, res) => {
        try {
            const docRef = db.collection('locations').doc(req.params.id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({
                    success: false,
                    message: req.t('locations.notFound')
                });
            }

            await docRef.delete();
            res.json({
                success: true,
                message: req.t('locations.deleteSuccess')
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = geoController;
