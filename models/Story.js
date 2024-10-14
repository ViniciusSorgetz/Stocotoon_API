const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = require("../models/Team");

const Story = db.define("Story", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

Team.hasMany(Story, {onDelete: "CASCADE"});
Story.belongsTo(Team);

module.exports = Story;