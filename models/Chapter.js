const { DataTypes } = require("sequelize");
const db = require("../db");

const Story = require("../models/Story")

const Chapter = db.define("Chapter", {
    name: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    }
});

Story.hasMany(Chapter);
Chapter.belongsTo(Story);

module.exports = Chapter;