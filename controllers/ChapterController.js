const Chapter = require("../models/Chapter");

module.exports = class ChapterController{

    static async create(req, res){

        const chapter = {
            name: req.body.name,
            StoryId: req.body.StoryId
        }

        if(!chapter.name || chapter.name.trim().length === 0){
            return res.status(400).json({
                message: "Nome do capítulo necessário"
            });
        }

        const checkChapter = await Chapter.findOne({where: {
            name: chapter.name, 
            StoryId: chapter.StoryId
        }});
        if(checkChapter){
            return res.status(400).json({
                message: "Nome de capítulo já em uso."
            });
        }

        try {
            Chapter.create(chapter);
            return res.status(200).json({
                message: "Capítulo criado com sucesso!"
            })
        } 
        catch (error) {
            return res.status(500).json({
                message: "Erro ao criar a pasta."
            });
        }
    }

    static async list(req, res){

        const StoryId = req.params.StoryId;
        
        try {
            const chapters = await Chapter.findAll({where: {StoryId: StoryId}});
            res.status(200).json(chapters);
        } 
        catch (error) {
            res.status(500).json({
                message: "Erro ao listar capítulos"
            })
        }

    }
}