const { DataTypes } = require("sequelize");
const db = require("../db");
const Page = require("../models/Page");

const Picture = db.define("Picture", {
    name: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    },
    src: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
    }
});

Picture.belongsTo(Page);
Page.hasOne(Picture);

module.exports = Picture; 