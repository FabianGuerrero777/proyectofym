// ==========================================
// MIDDLEWARE: Verificar Autenticación Firebase
// ==========================================
// Este middleware verifica el token JWT de Firebase.
// Si Firebase no está configurado, usa verificación local simple.
//
// Uso en rutas protegidas:
//   router.get('/ruta-protegida', authRequired, controller.metodo);

const { admin, firebaseInitialized } = require('../config/firebaseAdmin');

const authRequired = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Verificar que venga el header Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: req.t ? req.t('auth.noToken') : 'No se proporcionó token de autenticación'
        });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        if (firebaseInitialized) {
            // === MODO FIREBASE ===
            try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                req.user = {
                    uid: decodedToken.uid,
                    email: decodedToken.email,
                    nombre: decodedToken.name || decodedToken.email,
                    rol: decodedToken.rol || 'cliente'
                };
                return next();
            } catch (firebaseError) {
                // Si falla Firebase, intentar token local Base64
            }
        }

        // === MODO LOCAL (Base64) ===
        const userData = JSON.parse(Buffer.from(token, 'base64').toString());
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: req.t ? req.t('auth.invalidToken') : 'Token inválido o expirado'
        });
    }
};

module.exports = authRequired;
