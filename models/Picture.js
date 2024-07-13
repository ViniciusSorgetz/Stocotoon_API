const { DataTypes } = require("sequelize");
const db = require("../db");
const Page = require("../models/Page");

const Picture = db.define("Picture", {
    content: {
        type: DataTypes.JSON,
        allowNull: false,
    }
});

Picture.belongsTo(Page);
Page.hasOne(Picture);

module.exports = Picture; 