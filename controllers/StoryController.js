const Story = require("../models/Story");
const Chapter = require("../models/Chapter");

module.exports = class StoryController{

    static async create(req, res){

        const {TeamId, name, description} = req.body;

        // check name
        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário preencher o nome."
            });
        }
        const checkStory = await Story.findOne({where: {TeamId: TeamId, name: name}});
        if(checkStory){
            return res.status(400).json({
                message: "Nome de história já em uso.",
            })
        }

        // create story
        const newStory = {
            TeamId, 
            name: name.trim(), 
            description: description ? description.trim() : null,
        }

        const story = await Story.create(newStory);

        res.status(201).json({
            message: "História criada com sucesso.",
            story: story
        });
    }

    static async getInfo(req, res){

        const StoryId = req.params.StoryId;
        try {
            const story = await Story.findOne({where: {id: StoryId}, raw: true});
            const chapters = await Chapter.findAll({where: {StoryId: StoryId}});
            return res.status(200).json({
                ...story,
                chapters: [...chapters]
            })
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro ao resgatar dados da história. Tente novamente mais tarde."
            });
        }
    }

    static async edit(req, res){

        const { StoryId } = req.params;
        const {name, description} = req.body;
        const story = await Story.findOne({where: {id: StoryId}});

        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário preencher o nome."
            });
        }
        const checkStory = await Story.findOne({where: {name: name, TeamId: story.TeamId}});
        if(checkStory && checkStory.id != StoryId){
            return res.status(400).json({
                message: "Nome da história já em uso."
            });
        }
        const newStory = {
            name: name.trim(), 
            description: description ? description.trim() : null,
        }
        try {
            await Story.update(newStory, {where: {id: StoryId}});
            const updatedStory = await Story.findOne({where: {id: StoryId}});
            return res.status(200).json({
                message: "História editada com sucesso.",
                story: updatedStory
            });
        } 
        catch (error) {
            return res.status(500).json({
                message: "Algo deu errado ao editar história. Tente novamente mais tarde."
            });
        }
    }
}