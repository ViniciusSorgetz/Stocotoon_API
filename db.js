require('dotenv').config();

const { Sequelize } = require("sequelize");

// console.log(DB);

const sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql"
});

try {
    sequelize.authenticate();
    console.log("Conectado com MySQL!");

} catch (error) {
    console.log("Não foi possível conectar ao MySQL: " + error);
}

module.exports = sequelize;