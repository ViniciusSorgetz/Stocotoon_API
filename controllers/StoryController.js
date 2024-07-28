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
        const story = description 
        ? {
            TeamId, 
            name: name.trim(), 
            description: description.trim(),
        }
        : {
            TeamId, 
            name: name.trim()
        }

        await Story.create(story);

        res.status(201).json({
            message: "História criada com sucesso.",
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
}