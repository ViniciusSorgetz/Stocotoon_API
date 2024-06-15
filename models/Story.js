const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = require("../models/Team");

const Story = db.define("Story", {
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

Team.hasMany(Story);
Story.belongsTo(Team);

module.exports = Story;