const Chapter = require("../models/Chapter");
const User = require("../models/User");

module.exports = class ChapterController{
    static async create(req, res){

        const chapter = {
            name: req.body.name,
            UserId: req.body.UserId
        }

        const user = await User.findOne({where: {id: chapter.UserId}});
    
        if(!user){
            res.json({
                message: "Usuário não encontrado",
            });
            return;
        }

        try {
            Chapter.create(chapter);
            res.json({
                message: "Pasta criada com sucesso!"
            })
        } catch (error) {
            res.json({
                message: "Erro ao criar a pasta."
            })
        }
    }
}