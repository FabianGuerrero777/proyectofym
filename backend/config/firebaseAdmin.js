// ==========================================
// CONFIGURACIÓN DE FIREBASE ADMIN SDK
// ==========================================
// Para usar Firebase Authentication necesitas:
// 1. Crear un proyecto en https://console.firebase.google.com
// 2. Ir a Configuración > Cuentas de servicio
// 3. Generar nueva clave privada (descarga un JSON)
// 4. Guardar ese archivo como "serviceAccountKey.json" en esta carpeta (config/)
// 5. O configurar las variables de entorno en .env

const admin = require('firebase-admin');

let firebaseInitialized = false;

try {
    // Opción 1: Usar archivo serviceAccountKey.json
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
    });
    firebaseInitialized = true;
    console.log('🔥 Firebase Admin inicializado correctamente');
} catch (error) {
    // Opción 2: Si no hay archivo, intentar con variables de entorno
    if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            })
        });
        firebaseInitialized = true;
        console.log('🔥 Firebase Admin inicializado con variables de entorno');
    } else {
        console.error('⚠️  Firebase Admin NO configurado.');
        console.error('   Como ahora usamos Firestore como base de datos obligatoria,');
        console.error('   DEBES colocar tu archivo "serviceAccountKey.json" dentro de backend/config/');
        throw new Error("Falta el archivo backend/config/serviceAccountKey.json para conectar a Firestore.");
    }
}

module.exports = { admin, firebaseInitialized };
