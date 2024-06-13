const { DataTypes } = require("sequelize");
const db = require("../db");
const Page = require("../models/Page");

const Script = db.define("Script", {
    name: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        require: true,
        allowNull: false,
    },
});

Script.belongsTo(Page);
Page.hasOne(Script);

module.exports = Script;