const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = require("./Team");
const User = require("./User");

const Member = db.define("Member", {
    role: {
        type: DataTypes.ENUM,
        values: ["member", "owner"],
        allowNull: false
    }
});

User.belongsToMany(Team, {through: Member});
Team.belongsToMany(User, {through: Member});

module.exports = Member;