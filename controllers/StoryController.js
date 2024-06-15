const Story = require("../models/Story");
const Team = require("../models/Team");

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
        let story;
        if(description){
            story = {
                TeamId, 
                name: name.trim(), 
                description: description.trim(),
            }
        }
        else{
            story = {
                TeamId, 
                name: name.trim()
            }
        }

        await Story.create(story);

        res.status(201).json({
            message: "História criada com sucesso.",
        });
    }

    static async list(req, res){
        
        const TeamId = req.params.TeamId;
        const stories = await Story.findAll({where: {TeamId: TeamId}});

        res.json(stories);

    }
}