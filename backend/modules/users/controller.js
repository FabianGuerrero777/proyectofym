// ==========================================
// MÓDULO USERS - Controller
// ==========================================
// Lógica de negocio para gestión de usuarios/clientes

const bcrypt = require('bcrypt');
const { db } = require('../../models/models');

const userController = {
    // GET /users → Listar todos los usuarios
    getAll: async (req, res) => {
        try {
            let usersRef = db.collection('usuarios');
            if (req.query.rol) {
                usersRef = usersRef.where('rol', '==', req.query.rol);
            }

            const snapshot = await usersRef.get();
            const usuarios = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nombre: data.nombre,
                    email: data.email,
                    rol: data.rol,
                    telefono: data.telefono,
                    createdAt: data.createdAt
                };
            });

            res.json({
                success: true,
                message: req.t('users.listSuccess'),
                data: usuarios
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /users/:id → Obtener un usuario por ID
    getById: async (req, res) => {
        try {
            const doc = await db.collection('usuarios').doc(req.params.id).get();

            if (!doc.exists) {
                return res.status(404).json({
                    success: false,
                    message: req.t('users.notFound')
                });
            }

            const data = doc.data();
            res.json({
                success: true,
                data: {
                    id: doc.id,
                    nombre: data.nombre,
                    email: data.email,
                    rol: data.rol,
                    telefono: data.telefono,
                    createdAt: data.createdAt
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /users → Crear usuario
    create: async (req, res) => {
        try {
            const { nombre, email, password, rol, telefono } = req.body;
            const hashedPassword = await bcrypt.hash(password || '123456', 10);
            
            // Revisa si ya existe el email
            const existing = await db.collection('usuarios').where('email', '==', email).limit(1).get();
            if (!existing.empty) {
                return res.status(400).json({ success: false, message: "El email ya está en uso" });
            }

            const newUserRef = db.collection('usuarios').doc();
            const userData = {
                nombre,
                email,
                password: hashedPassword,
                rol: rol || 'cliente',
                telefono: telefono || null,
                createdAt: new Date().toISOString()
            };
            await newUserRef.set(userData);

            res.status(201).json({
                success: true,
                message: req.t('users.createSuccess'),
                data: {
                    id: newUserRef.id,
                    nombre: userData.nombre,
                    email: userData.email,
                    rol: userData.rol,
                    telefono: userData.telefono
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /users/:id → Actualizar usuario
    update: async (req, res) => {
        try {
            const userRef = db.collection('usuarios').doc(req.params.id);
            const doc = await userRef.get();
            if (!doc.exists) {
                return res.status(404).json({
                    success: false,
                    message: req.t('users.notFound')
                });
            }

            const updateData = {};
            if (req.body.nombre) updateData.nombre = req.body.nombre;
            if (req.body.email) updateData.email = req.body.email;
            if (req.body.rol) updateData.rol = req.body.rol;
            if (req.body.telefono) updateData.telefono = req.body.telefono;
            if (req.body.password) {
                updateData.password = await bcrypt.hash(req.body.password, 10);
            }

            await userRef.update(updateData);

            res.json({
                success: true,
                message: req.t('users.updateSuccess'),
                data: {
                    id: doc.id,
                    ...doc.data(),
                    ...updateData
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /users/:id → Eliminar usuario
    delete: async (req, res) => {
        try {
            const userRef = db.collection('usuarios').doc(req.params.id);
            const doc = await userRef.get();
            if (!doc.exists) {
                return res.status(404).json({
                    success: false,
                    message: req.t('users.notFound')
                });
            }

            await userRef.delete();
            res.json({
                success: true,
                message: req.t('users.deleteSuccess')
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = userController;
