const { sequelize, Usuario } = require('./backend/models/models');
const bcrypt = require('bcrypt');

async function resetUsers() {
    try {
        await sequelize.authenticate();
        console.log("Conectado a la BD.");

        // 1. Eliminar usuarios antiguos y posibles duplicados de los nuevos
        const emailsToDelete = [
            'admin@fmweb.com',
            'cliente@test.com',
            'admin@fandmweb.com',
            'cliente@fandmweb.com'
        ];

        await Usuario.destroy({
            where: {
                email: emailsToDelete
            }
        });
        console.log("Usuarios antiguos eliminados.");

        // 2. Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash("666", 10);

        // 3. Crear nuevos usuarios
        await Usuario.create({
            nombre: "Admin F&M",
            email: "admin@fandmweb.com",
            password: hashedPassword,
            rol: "admin"
        });
        console.log("✅ Admin creado: admin@fandmweb.com / 666");

        await Usuario.create({
            nombre: "Cliente F&M",
            email: "cliente@fandmweb.com",
            password: hashedPassword,
            rol: "cliente"
        });
        console.log("✅ Cliente creado: cliente@fandmweb.com / 666");

    } catch (error) {
        console.error("Error reseteando usuarios:", error);
    } finally {
        await sequelize.close();
    }
}

resetUsers();
