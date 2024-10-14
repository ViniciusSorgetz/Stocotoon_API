const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = require("./Team");

const Chat = db.define("Chat", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

Team.hasMany(Chat, {onDelete: "CASCADE"});
Chat.belongsTo(Team);

module.exports = Chat;