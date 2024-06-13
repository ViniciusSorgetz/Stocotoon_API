const { DataTypes, INTEGER } = require("sequelize");
const db = require("../db");

const Team = require("../models/Team");

const Member = db.define("Member", {
    UserId: {
        type: INTEGER,
        require: true,
        allowNull: false,
    },
});

Team.hasMany(Member);
Member.belongsTo(Team);

module.exports = Member;