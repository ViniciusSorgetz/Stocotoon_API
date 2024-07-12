require("dotenv").config();
const Member = require("../models/Member");
const Team = require("../models/Team");
const Story = require("../models/Story");

const getDecodedToken = require("../utils/getDecodedToken");

module.exports = async function checkTokenByStory(req, res, next){

    const StoryId = req.body.StoryId || req.params.StoryId;

    // story validation
    if(!StoryId || StoryId === ":StoryId"){
        return res.status(400).json({
            message: "StoryId necessário."
        });
    }

    const story = await Story.findOne({where: {id: StoryId}});
    
    if(!story){
        return res.status(404).json({
            message: "Equipe não encontrada."
        });
    }

    // get Team which story belongs to
    const TeamId = story.TeamId
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