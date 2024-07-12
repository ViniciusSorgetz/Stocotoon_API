const Team = require("../models/Team");
const Member = require("../models/Member");

const getDecodedToken = require("../utils/getDecodedToken");

module.exports = async function checkTokenByTeam(req, res, next){

    const TeamId = req.body.TeamId || req.params.TeamId;

    // team validation
    if(!TeamId){
        return res.status(400).json({
            message: "TeamId necessário."
        });
    }

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
            message: "Acesso negado"
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