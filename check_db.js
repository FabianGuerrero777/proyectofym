const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

async function check() {
    try {
        await sequelize.authenticate();
        console.log("Conexión exitosa.");
        const tables = await sequelize.getQueryInterface().showAllSchemas();
        // En SQLite showAllSchemas podría no devolver lo mismo, mejor verificar con query directa o getTableNames()
        // Sequelize tiene getQueryInterface().showAllTables() en algunas versiones, o select from sqlite_master

        const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
        console.log("Tablas en database.sqlite:", results);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

check();
