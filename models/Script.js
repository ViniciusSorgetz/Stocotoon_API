const { DataTypes } = require("sequelize");
const db = require("../db");
const Page = require("../models/Page");

const Script = db.define("Script", {
    content: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

Script.belongsTo(Page);
Page.hasOne(Script);

module.exports = Script;