require("dotenv").config();
const Member = require("../models/Member");
const Team = require("../models/Team");
const Chat = require("../models/Chat");

const getDecodedToken = require("../utils/getDecodedToken");

module.exports = async function checkTokenByChat2(req, res, next){

    const ChatId = req.params.ChatId;

    // chat validation
    if(!ChatId || ChatId === ":ChatId"){
        return res.status(400).json({
            message: "ChatId necessário."
        });
    }

    const chat = await Chat.findOne({where: {id: ChatId}});
    
    if(!chat){
        return res.status(404).json({
            message: "História não encontrada."
        });
    }

    // get Team which chat belongs to
    const TeamId = chat.TeamId
    const team = await Team.findOne({where: {id: TeamId}});
    if(!team){
        return res.status(404).json({
            message: "Equipe não encontrada."
        });
    }

    // user validation

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Acesso negado."
        });
    }

    // verify token by ownerId
    const UserId = await getDecodedToken(token);
    const member = await Member.findOne({where: {TeamId: TeamId, UserId: UserId}});
    if(!member){
        return res.status(400).json({
            message: "Token de usuário inválido."
        });
    }
    else{
        next();
    }
}