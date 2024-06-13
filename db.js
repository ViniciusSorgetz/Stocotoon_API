const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("minhaapi", "root", "password", {
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