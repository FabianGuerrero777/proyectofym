// ==========================================
// MÓDULO AUTH - Controller
// ==========================================
// Lógica de negocio para autenticación (login y registro)

const bcrypt = require('bcrypt');
const { db } = require('../../models/models');
const { admin, firebaseInitialized } = require('../../config/firebaseAdmin');

const authController = {
    // POST /auth/login
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const usersRef = db.collection('usuarios');
            const snapshot = await usersRef.where('email', '==', email).limit(1).get();

            if (snapshot.empty) {
                return res.status(401).json({
                    success: false,
                    message: req.t('auth.loginFail')
                });
            }

            const userDoc = snapshot.docs[0];
            const user = { id: userDoc.id, ...userDoc.data() };

            // Verificar contraseña con bcrypt
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: req.t('auth.loginFail')
                });
            }

            // Generar token local (Base64 del usuario)
            const tokenData = { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol };
            const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

            res.json({
                success: true,
                message: req.t('auth.loginSuccess'),
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol
                },
                token
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /auth/register
    register: async (req, res) => {
        try {
            const { nombre, email, password, rol } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

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
                createdAt: new Date().toISOString()
            };

            await newUserRef.set(userData);
            const usuario = { id: newUserRef.id, ...userData };

            // Si Firebase está activo, también crear usuario en Firebase
            if (firebaseInitialized) {
                try {
                    await admin.auth().createUser({
                        email,
                        password,
                        displayName: nombre
                    });
                } catch (fbError) {
                    console.log('⚠️ No se pudo crear en Firebase:', fbError.message);
                }
            }

            res.json({
                success: true,
                message: req.t('auth.registerSuccess'),
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = authController;
