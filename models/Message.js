const { DataTypes } = require("sequelize");
const db = require("../db");

const Chat = require("./Chat");
const User = require("./User");

const Message = db.define("Message", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ChatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: Chat,
            key: "id"
        }
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: User,
            key: "id",
        }
    }
});

User.belongsToMany(Chat, {through: { model: Message, unique: false}, onDelete: 'CASCADE'});
Chat.belongsToMany(User, {through: { model: Message, unique: false}, onDelete: 'CASCADE'});

module.exports = Message;