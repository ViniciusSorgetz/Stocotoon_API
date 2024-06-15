const Team = require("../models/Team");
const Member = require("../models/Member");
const User = require("../models/User");

module.exports = class TeamController{

    static async create(req, res){

        const {UserId, name, description} = req.body;

        // User validation
        if(!UserId){
            return res.status(400).json({
                message: "Necessário informar o id do usuário."
            });
        }
        const checkUser = await User.findOne({where: {id: UserId}});
        if(!checkUser){
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }
        
        // name validation
        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário preencher o nome da equipe."
            });
        }
        
        // team creation
        let team;
        
        if(description){
            team = {
                UserId,
                name: name.trim(),
                description: description.trim(),
            }
        }
        else{
            UserId,
            team = {name: name.trim()}
        }

        try {
            const createdTeam = await Team.create(team);
            await Member.create({
                UserId, 
                TeamId: createdTeam.id}
            );
            res.status(201).json({
                message: "Equipe criada com sucesso!"
            });
        } 
        catch (error) {
            res.status(500).json({
                message: "Ocorreu um erro. Tente novamente mais tarde."
            });
            console.log(error);
        }
    }

    static async list(req, res){
        // check user
        const UserId = req.params.UserId;
        const user = await User.findOne({where: {id: UserId}});
        if(!user){
            return res.status(404).json({
                message: "Erro ao listar times. Usuário não encontrado."
            });
        }

        // get user teams
        const teamsId = await Member.findAll({where: {UserId: UserId}});
        const teams = [];
        for(let i=0; i<teamsId.length; i++){
            const team = await Team.findOne({where: {id: teamsId[i].id}});
            teams.push(team);
        }
        res.json(teams);
    }
}