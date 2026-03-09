const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importamos bcrypt
// Importamos nuestros modelos unificados
const { sequelize, Usuario, Proyecto, Avance, Pago } = require('../models/models');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. INICIALIZACIÓN DE BASE DE DATOS
// ==========================================
// force: false para NO borrar datos cada vez.
// alter: true intenta actualizar tablas si cambias algo en models.js
sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Base de datos sincronizada correctamente.");
}).catch(err => console.log("Error DB:", err));

// ==========================================
// 2. RUTAS DE AUTENTICACIÓN (RF-01)
// ==========================================

// REGISTRO (Para crear usuarios inicialmente)
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Hashing de contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol
        });

        res.json({ success: true, usuario });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// LOGIN (RF-01, RF-02)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Verificar contraseña con bcrypt
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Devolvemos el usuario para que el frontend sepa el Rol
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 3. RUTAS DE PROYECTOS (RF-04, RF-05, RF-09)
// ==========================================

// OBTENER TODOS LOS USUARIOS (Para Tabla Admin)
app.get('/api/users-all', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'email', 'rol', 'nombre'] // Solo lo necesario
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// OBTENER CLIENTES (Para que el Admin asigne proyectos en dropdown)
app.get('/api/usuarios', async (req, res) => {
    // Solo devolvemos clientes para asignar proyectos
    const usuarios = await Usuario.findAll({ where: { rol: 'cliente' } });
    res.json(usuarios);
});

// OBTENER PROYECTOS (RF-02 - Filtrado por Rol)
app.get('/api/proyectos/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await Usuario.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        let proyectos;
        // Admin y Moderador ven TODO
        if (user.rol === 'admin' || user.rol === 'moderador') {
            proyectos = await Proyecto.findAll({
                include: ['cliente', Avance, Pago]
            });
        } else {
            // Cliente ve SOLO SUYO (RF-05)
            proyectos = await Proyecto.findAll({
                where: { clienteId: userId },
                include: [Avance, Pago]
            });
        }
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREAR PROYECTO (Admin)
app.post('/api/proyectos', async (req, res) => {
    try {
        const proyecto = await Proyecto.create(req.body);
        res.json({ success: true, proyecto });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ACTUALIZAR ESTADO (RF-07) - Admin y Moderador
app.put('/api/proyectos/:id', async (req, res) => {
    try {
        // En un sistema real verificaríamos aquí si el usuario que hace la petición es admin o moderador
        await Proyecto.update(req.body, { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 4. RUTAS DE USUARIOS (Actualizar / Eliminar)
// ==========================================

// ACTUALIZAR USUARIO
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        // Solo actualizamos los campos que se envían
        const updateData = {};
        if (req.body.nombre) updateData.nombre = req.body.nombre;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.rol) updateData.rol = req.body.rol;
        if (req.body.telefono) updateData.telefono = req.body.telefono;
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10);
        }

        await usuario.update(updateData);
        res.json({ success: true, usuario });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ELIMINAR USUARIO
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        await usuario.destroy();
        res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 5. ELIMINAR PROYECTO
// ==========================================

// ELIMINAR PROYECTO
app.delete('/api/proyectos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });

        await proyecto.destroy();
        res.json({ success: true, message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 6. PAGOS
// ==========================================

// AGREGAR PAGO
app.post('/api/pagos', async (req, res) => {
    try {
        const pago = await Pago.create(req.body); // { monto, descripcion, ProyectoId }
        res.json({ success: true, pago });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor F&M WEB listo en puerto ${PORT}`));