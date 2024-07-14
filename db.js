require('dotenv').config();

const { Sequelize } = require("sequelize");
const DB = process.env.DB;
const PASSWORD = process.env.PASSWORD;

console.log(DB);

const sequelize = new Sequelize( DB, "root", PASSWORD, {
    host: "localhost",
    dialect: "mysql"
});

try {
    sequelize.authenticate();
    console.log("Conectado com MySQL!");

} catch (error) {
    console.log("Não foi possível conectar ao MySQL: " + error);
}

module.exports = sequelize;