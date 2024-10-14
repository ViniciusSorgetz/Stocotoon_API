const { DataTypes } = require("sequelize");
const db = require("../db");
const Chapter = require("./Chapter");

const Page = db.define("Page", {
    name: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    },
});

Page.belongsTo(Chapter, {onDelete: 'CASCADE'});
Chapter.hasMany(Page);

module.exports = Page;