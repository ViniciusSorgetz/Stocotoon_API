require("dotenv").config();
const jwt = require("jsonwebtoken");
const Page = require("../models/Page");
const Chapter = require("../models/Chapter");
const Story = require("../models/Story");
const Member = require("../models/Member");
const getDcodedToken = require("../utils/getDecodedToken");

module.exports = async function checkTokenByPage(req, res, next){

    const PageId = req.body.PageId || req.params.PageId;

    if(!PageId){
        return res.status(400).json({
            message: "PageId necessário."
        })
    }

    //check if chapter exists
    const page = await Page.findOne({where: {id: PageId}});
    if(!page){
        return res.status(404).json({
            message: "Página não encontrada."
        });
    }

    // get UserId
    const chapter = await Chapter.findOne({where: {id: page.ChapterId}});
    const story = await Story.findOne({where: {id: chapter.StoryId}});

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Acesso negado"
        });
    }

    const UserId = await getDcodedToken(token);
    const checkMember = await Member.findOne({where: {TeamId: story.TeamId, UserId: UserId}});

    if(!checkMember){
        return res.status(401).json({
            message: "Usuário sem permissão."
        })
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret, async (err, decodedToken) => {
            if (err) {
                return res.status(400).json({
                    message: "Token inválido."
                });
            }

            if (decodedToken.id !== UserId) {
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
}