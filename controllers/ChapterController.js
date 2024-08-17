const Chapter = require("../models/Chapter");
const Page = require("../models/Page");

module.exports = class ChapterController{

    static async create(req, res){

        const {name, StoryId} = req.body
        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Nome do capítulo necessário"
            });
        }

        const checkChapter = await Chapter.findOne({where: {name: name, StoryId: StoryId}});
        if(checkChapter){
            return res.status(400).json({
                message: "Nome de capítulo já em uso."
            });
        }
        try {
            await Chapter.create({name, StoryId});
            const newChapter = await Chapter.findOne({where: {name: name, StoryId: StoryId}});
            return res.status(200).json({
                message: "Capítulo criado com sucesso!",
                chapter: newChapter
            })
        } 
        catch (error) {
            return res.status(500).json({
                message: "Erro ao criar a pasta."
            });
        }
    }

    static async getInfo(req, res){

        const ChapterId = req.params.ChapterId;
        
        try {
            const chapter = await Chapter.findOne({where: {id: ChapterId}, raw: true})
            const pages = await Page.findAll({where: {ChapterId: ChapterId}, raw: true});
            res.status(200).json({
                ...chapter,
                pages: [...pages]
            });
        } 
        catch (error) {
            res.status(500).json({
                message: "Erro ao listar capítulos"
            })
        }
    }
}