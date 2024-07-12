const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = db.define("Team", {
    name: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

module.exports = Team;
