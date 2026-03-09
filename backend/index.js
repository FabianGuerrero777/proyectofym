// ==========================================
// F&M WEB - Servidor Principal (Microservicios)
// ==========================================
// Este archivo es el punto de entrada del backend.
// Importa los controllers de cada módulo y registra
// las rutas de manera centralizada.
//
// Para ejecutar: node backend/index.js
// ==========================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

// Cargar variables de entorno (si existe .env)
try { require('dotenv').config({ path: path.join(__dirname, '.env') }); } catch (e) { /* dotenv opcional */ }

// Base de datos (Firestore)
const { db } = require('./models/models');

// Middlewares personalizados
const i18n = require('./middleware/i18n');
const authRequired = require('./middleware/authRequired');

// Controllers de cada microservicio
const authController = require('./modules/auth/controller');
const userController = require('./modules/users/controller');
const geoController = require('./modules/geo/controller');
const iaController = require('./modules/ia/controller');
const projectController = require('./modules/projects/controller');

// ==========================================
// INICIALIZAR APP
// ==========================================
const app = express();

// Middlewares globales
app.use(cors());                    // Permitir peticiones de otros orígenes
app.use(express.json());            // Parsear body JSON
app.use(i18n);                      // Internacionalización en cada petición

// Servir archivos estáticos del frontend
const frontendPath = path.resolve(__dirname, '..', 'FrontEnd');
console.log('📂 Frontend path:', frontendPath);
app.use(express.static(frontendPath));

// Fallback: servir index.html en la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ==========================================
// MICROSERVICIO 1: AUTH (/auth)
// ==========================================
app.post('/auth/login', authController.login);
app.post('/auth/register', authController.register);

// Google Sign-In: recibe datos del usuario autenticado por Firebase client SDK
app.post('/auth/google', async (req, res) => {
    const { idToken, email, nombre, uid } = req.body;
    try {
        const { admin, firebaseInitialized } = require('./config/firebaseAdmin');
        let userEmail = email;
        let userName = nombre;
        let userUid = uid;

        // Si Firebase Admin está configurado, verificar el token
        if (firebaseInitialized && idToken) {
            const decoded = await admin.auth().verifyIdToken(idToken);
            userEmail = decoded.email;
            userName = decoded.name || decoded.email.split('@')[0];
            userUid = decoded.uid;
        }
        // Si no está configurado, confiamos en los datos del client SDK

        if (!userEmail) {
            return res.status(400).json({ success: false, message: 'Email es requerido' });
        }

        // Buscar o crear usuario en la BD local
        let user = await Usuario.findOne({ where: { email: userEmail } });
        if (!user) {
            user = await Usuario.create({
                nombre: userName || userEmail.split('@')[0],
                email: userEmail,
                password: await bcrypt.hash(userUid || 'google-user-' + Date.now(), 10),
                rol: 'cliente'
            });
        }

        // Generar token local
        const tokenData = { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol };
        const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

        res.json({
            success: true,
            message: 'Login con Google exitoso',
            user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
            token
        });
    } catch (error) {
        console.error('Error Google Auth:', error.message);
        res.status(401).json({ success: false, message: 'Error al iniciar sesión con Google: ' + error.message });
    }
});

// ==========================================
// I18N FRONTEND (/translations/:lang)
// ==========================================
const fs = require('fs');
app.get('/translations/:lang', (req, res) => {
    const lang = req.params.lang || 'es';
    const filePath = path.join(__dirname, 'i18n', `${lang}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // Fallback a español si no existe
            const fallbackPath = path.join(__dirname, 'i18n', 'es.json');
            fs.readFile(fallbackPath, 'utf8', (errFallback, dataFallback) => {
                if (errFallback) return res.status(500).json({ error: 'Translations not found' });
                const translations = JSON.parse(dataFallback);
                return res.json(translations.frontend || translations);
            });
        } else {
            const translations = JSON.parse(data);
            return res.json(translations.frontend || translations);
        }
    });
});

// ==========================================
// MICROSERVICIO 2: USERS (/users y /clientes)
// ==========================================
app.get('/users', authRequired, userController.getAll);
app.get('/users/:id', authRequired, userController.getById);
app.post('/users', authRequired, userController.create);
app.put('/users/:id', authRequired, userController.update);
app.delete('/users/:id', authRequired, userController.delete);

// Alias /clientes → mismos controladores
app.get('/clientes', authRequired, userController.getAll);
app.get('/clientes/:id', authRequired, userController.getById);
app.post('/clientes', authRequired, userController.create);
app.put('/clientes/:id', authRequired, userController.update);
app.delete('/clientes/:id', authRequired, userController.delete);

// ==========================================
// MICROSERVICIO 3: GEO (/locations)
// ==========================================
app.get('/locations', authRequired, geoController.getAll);
app.get('/locations/:id', authRequired, geoController.getById);
app.post('/locations', authRequired, geoController.create);
app.put('/locations/:id', authRequired, geoController.update);
app.delete('/locations/:id', authRequired, geoController.delete);

// ==========================================
// MICROSERVICIO 4: IA (/ai)
// ==========================================
app.post('/ai/analyze', authRequired, iaController.analyze);

// ==========================================
// MICROSERVICIO 5: PROJECTS (/projects)
// ==========================================
app.get('/projects/:userId', projectController.getByUser);
app.post('/projects', authRequired, projectController.create);
app.put('/projects/:id', authRequired, projectController.update);
app.delete('/projects/:id', authRequired, projectController.delete);

// Ruta legacy de IA para el frontend (sin auth requerido)
app.post('/api/ai-analyze', iaController.analyze);

// Rutas legacy de locations para el mapa del frontend
app.get('/api/locations', geoController.getAll);
app.post('/api/locations', geoController.create);

// ==========================================
// COMPATIBILIDAD CON FRONTEND EXISTENTE
// ==========================================
// Endpoints /api/* para que el frontend anterior siga funcionando.

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usersRef = db.collection('usuarios');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();
        if (snapshot.empty) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        
        const userDoc = snapshot.docs[0];
        const user = { ...userDoc.data(), id: userDoc.id };
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        res.json({ success: true, user });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUserRef = db.collection('usuarios').doc();
        const userData = { nombre, email, password: hashedPassword, rol: rol || 'cliente' };
        await newUserRef.set(userData);
        
        res.json({ success: true, usuario: { id: newUserRef.id, ...userData } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/users-all', async (req, res) => {
    try {
        const snapshot = await db.collection('usuarios').get();
        const usuarios = snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, email: data.email, rol: data.rol, nombre: data.nombre };
        });
        res.json(usuarios);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const snapshot = await db.collection('usuarios').where('rol', '==', 'cliente').get();
        const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(usuarios);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const userRef = db.collection('usuarios').doc(req.params.id);
        const doc = await userRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        
        const updateData = {};
        if (req.body.nombre) updateData.nombre = req.body.nombre;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.rol) updateData.rol = req.body.rol;
        if (req.body.telefono) updateData.telefono = req.body.telefono;
        if (req.body.password) updateData.password = await bcrypt.hash(req.body.password, 10);
        
        await userRef.update(updateData);
        res.json({ success: true, usuario: { id: doc.id, ...doc.data(), ...updateData } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const userRef = db.collection('usuarios').doc(req.params.id);
        const doc = await userRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        await userRef.delete();
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/proyectos/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userRef = db.collection('usuarios').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) return res.status(404).json({ message: 'Usuario no encontrado' });
        
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
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/projects/:id/comments', projectController.addComment);

app.post('/api/proyectos', async (req, res) => {
    try {
        const docRef = db.collection('proyectos').doc();
        const data = {
            ...req.body,
            estado: req.body.estado || 'Pendiente',
            progreso: req.body.progreso || 0,
            fechaInicio: new Date().toISOString()
        };
        await docRef.set(data);
        res.json({ success: true, proyecto: { id: docRef.id, ...data } });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.put('/api/proyectos/:id', async (req, res) => {
    try {
        const docRef = db.collection('proyectos').doc(req.params.id);
        await docRef.update(req.body);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.delete('/api/proyectos/:id', async (req, res) => {
    try {
        const docRef = db.collection('proyectos').doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        await docRef.delete();
        res.json({ success: true, message: 'Proyecto eliminado' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post('/api/pagos', async (req, res) => {
    try {
        const pagoRef = db.collection(`proyectos/${req.body.proyectoId}/pagos`).doc();
        await pagoRef.set(req.body);
        res.json({ success: true, pago: { id: pagoRef.id, ...req.body } });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// ==========================================
// SINCRONIZAR BD E INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

// Desactivar FK checks y sync es innecesario en Firestore
console.log('✅ Base de datos Firestore Inicializada correctamente.');
console.log('');
console.log('📦 Microservicios montados:');
console.log('   🔐 Auth     → POST /auth/login, POST /auth/register');
console.log('   👤 Users    → GET/POST/PUT/DELETE /users, /clientes');
console.log('   📍 Geo      → GET/POST/PUT/DELETE /locations');
console.log('   🤖 IA       → POST /ai/analyze');
console.log('   🔄 Legacy   → /api/* (compatibilidad frontend existente)');
console.log('');

app.listen(PORT, () => {
    console.log(`🚀 Servidor F&M WEB listo en puerto ${PORT}`);
    console.log(`   http://localhost:${PORT}`);
});
