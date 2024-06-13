const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("../models/User");

const Team = db.define("Team", {
    name: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    }
});

User.hasMany(Team);
Team.belongsTo(User);

module.exports = Team;
