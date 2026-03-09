
const { sequelize, Usuario } = require('./backend/models/models');
const bcrypt = require('bcrypt');

async function fixPasswords() {
    try {
        await sequelize.authenticate();
        console.log("Conectado a la BD.");

        const hashedPassword = await bcrypt.hash("123", 10);

        // Actualizar Admin
        const [updatedAdmin] = await Usuario.update(
            { password: hashedPassword },
            { where: { email: 'admin@fmweb.com' } }
        );
        console.log(`Admin actualizado: ${updatedAdmin}`);

        // Actualizar Cliente
        const [updatedClient] = await Usuario.update(
            { password: hashedPassword },
            { where: { email: 'cliente@test.com' } }
        );
        console.log(`Cliente actualizado: ${updatedClient}`);

    } catch (error) {
        console.error("Error corrigiendo passwords:", error);
    } finally {
        await sequelize.close();
    }
}

fixPasswords();
