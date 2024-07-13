require("dotenv").config();

const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const Team = require("../models/Team");
const Member = require("../models/Member");

const getDecodedToken = require("../utils/getDecodedToken");

module.exports = async function checkTokenByStory(req, res, next){

    const ChapterId = req.body.ChapterId;
    if(!ChapterId){
        return res.status(400).json({
            message: "Necessário informar o id do capítulo."
        });
    }
    try {
        const chapter = await Chapter.findOne({where: {id: ChapterId}});
        if(!chapter){
            return res.status(404).json({
                message: "Capítulo não encontrado."
            })
        }
        const story = await Story.findOne({where: {id: chapter.StoryId}});

        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if(!token){
            return res.status(400).json({
                message: "Necessário token"
            })
        }

        const UserId = await getDecodedToken(token);
        const member = await Member.findOne({where: {UserId: UserId, TeamId: story.TeamId}});

        if(!member){
            return res.status(400).json({
                message: "Acesso negado."
            });
        }

        next();
    }
    catch (error) {
        return res.status(500).json({
            message: "Ocorreu um erro. Tente novamente mais tarde."
        });
    }



}