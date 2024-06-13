require("dotenv").config();
const jwt = require("jsonwebtoken");
const Chapter = require("../models/Chapter");

module.exports = async function checkTokenByChapter(req, res, next){

    const ChapterId = req.body.ChapterId;

    if(!ChapterId){
        return res.status(400).json({
            message: "ChapterId necessário."
        })
    }

    //check if chapter exists
    const chapter = await Chapter.findOne({where: {id: ChapterId}});
    if(!chapter){
        return res.status(404).json({
            message: "Pasta não encontrada."
        });
    }

    const UserId = chapter.UserId;

    // check if token and UserId match
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Acesso negado"
        });
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