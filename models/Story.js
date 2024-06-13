const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = require("../models/Team");

const Story = db.define("Story", {
    name: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    }
});

Team.hasMany(Story);
Story.belongsTo(Team);

module.exports = Story;