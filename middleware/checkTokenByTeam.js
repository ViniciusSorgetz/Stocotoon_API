require("dotenv").config();
const jwt = require("jsonwebtoken");
const Team = require("../models/Team");
const Member = require("../models/Member");

module.exports = async function checkTokenByTeam(req, res, next){

    let TeamId = req.body.TeamId;
    if(!TeamId)
        TeamId = Number(req.params.TeamId);

    // team validation
    if(!TeamId){
        return res.status(400).json({
            message: "TeamId necessário."
        })
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
    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret, async (err, decodedToken) => {
            if (err) {
                return res.status(400).json({
                    message: "Token inválido."
                });
            }
            const member = await Member.findOne({where: {TeamId: TeamId, UserId: decodedToken.id}});
            if(!member){
                return res.status(400).json({
                    message: "Token de usuário inválido."
                });
            }
            else{
                next();
            }
        });

    } catch (error) {
        res.status(400).json({
            message: "Token inválido."
        })
    }

    //verify token by memberId

}