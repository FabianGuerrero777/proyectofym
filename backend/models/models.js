const { admin } = require('../config/firebaseAdmin');

// Obtener la instancia de base de datos
const db = admin.firestore();

// Exportamos la instancia de db para que
// los controladores se encarguen de interactuar con Firestore.
module.exports = { db, admin };