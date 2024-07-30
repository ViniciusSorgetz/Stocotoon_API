const Member = require("../models/Member");
const Chat = require("../models/Chat");
const Team = require("../models/Team");
const User = require("../models/User");
const getDcodedToken = require("../utils/getDecodedToken");
const { classToInvokable } = require("sequelize/lib/utils");

module.exports = async function checkTokenByChat(req, res, next){

    let UserId = req.body.UserId;
    if(!UserId)
        UserId = Number(req.params.UserId);

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Acesso negado"
        });
    }

    const decodedToken = await getDcodedToken(token);

    if (decodedToken !== UserId) {
        return res.status(400).json({
            message: "Token de usuário inválido."
        });
    }
    
    const user = await User.findOne({where: {id: decodedToken}});
    if(!user){
        return res.status(404).json({
            message: "Usuário não encontrado."
        })
    }
    const {ChatId} = req.body;
    const chat = await Chat.findOne({where: {id: ChatId}});
    if(!chat){
        return res.status(404).json({
            message: "Chat não encontrado."
        })
    }
    const checkMember = await Member.findOne({where: {TeamId: chat.TeamId, UserId: UserId}});
    if(!checkMember){
        return res.status(400).json({
            message: "Usuário sem permissão."
        });
    }
    next();
}

