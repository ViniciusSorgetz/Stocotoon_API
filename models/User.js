const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = require("./Team");

const User = db.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePictureURL: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = User;