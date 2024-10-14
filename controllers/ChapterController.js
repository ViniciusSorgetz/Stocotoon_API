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

    static async edit(req, res){

        const { ChapterId } = req.params;
        const { name } = req.body;
        const chapter = await Chapter.findOne({where: {id: ChapterId}});

        if(!name || name.trim().length == 0){
            return res.status(400).json({
                message: "Necessário informar o nome do capítulo."
            })
        }

        try {
            // verificar novo nome do capítulo
            const checkChapter = await Chapter.findOne({where: {name, StoryId: chapter.StoryId}});
            if(checkChapter && checkChapter.id != chapter.id){
                return res.status(400).json({
                    message: "Nome de capítulo já em uso."
                });
            }
            const newChapter = {name: name.trim()}
            await Chapter.update(newChapter, {where: {id: ChapterId}});
            const updatedChapter = await Chapter.findOne({where: {id: ChapterId}});
            return res.status(200).json({
                message: "Capítulo editado com sucesso.",
                chapter: updatedChapter
            });
        } 
        catch (error) {
            return res.status(500).json({
                message: "Erro ao editar capítulo. Tente novamente mais tarde."
            })
        }
    }

    static async delete(req, res){

        const { ChapterId } = req.params;

        try {
            await Chapter.destroy({where: {id: ChapterId}});
            return res.status(200).json({
                message: "Capítulo deletado com sucesso.",
            });
        } 
        catch (error) {
            return res.status(500).json({
                message: "Erro ao deletar capítulo. Tente novamente mais tarde."
            })
        }
    }
}