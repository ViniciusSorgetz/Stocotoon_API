const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = require("./Team");
const User = require("./User");

const Member = db.define("Member", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    role: {
        type: DataTypes.ENUM,
        values: ["member", "owner"],
        allowNull: false
    }
});

User.belongsToMany(Team, {through: Member, onDelete: 'CASCADE'});
Team.belongsToMany(User, {through: Member, onDelete: 'CASCADE'});

module.exports = Member;