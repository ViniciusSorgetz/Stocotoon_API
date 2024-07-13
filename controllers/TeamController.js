const Team = require("../models/Team");
const Member = require("../models/Member");
const User = require("../models/User");

const getDocodedToken = require("../utils/getDecodedToken");

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
        const checkTeam = await Team.findOne({where: {name: name}});
        if(checkTeam){
            return res.status(400).json({
                message: "Nome da equipe já em uso."
            })
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
                TeamId: createdTeam.id,
                role: "owner"
            });
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
        const userTeams = await Member.findAll({where: {UserId: UserId}, raw: true});
        const teams = await Promise.all (userTeams.map(async userTeam => 
            await Team.findOne({where: {id: userTeam.TeamId}, raw: true})
        ));
        res.status(200).json(teams);
    }

    static async addMember (req, res){

        // check token and if token's user has "owner" role
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        const UserId = await getDocodedToken(token);
        const TeamId = req.body.TeamId;

        if(!TeamId){
            return res.status(400).json({
                message: "Necessário informar o id do time."
            });
        }

        const owner = await Member.findOne({where: {UserId: UserId, TeamId: TeamId}});

        if(!owner || owner.role !== "owner"){
            return res.status(400).json({
                message: "Usuário sem permissão na equipe."
            });
        }
    
        // check if member exists
        const memberEmail = req.body.email;

        if(!memberEmail){
            return res.status(400).json({
                message: "Necessário informar o e-mail do membro"
            })
        }

        const member = await User.findOne({where: {email: memberEmail}});

        if(!member){
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }

        // check if member isn't already in the team
        const checkMember = await Member.findOne({where: {UserId: member.id, TeamId: TeamId}});
        if(checkMember){
            return res.status(400).json({
                message: "Este usuário já está nesta equipe."
            });
        }

        try {
            await Member.create({
                UserId: member.id,
                TeamId: TeamId,
                role: "member"
            });
            return res.status(200).json({
                message: "Usuário adicionado ao time."
            });
        } 
        catch (error) {
            return res.status(500).json({
                message: "Ocorreu um erro. Tente novamente mais tarde."
            });
        }
    }

    static async removeMember(req, res){
        
        // check token and if token's user has "owner" role
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        const UserId = await getDocodedToken(token);
        const TeamId = req.body.TeamId;

        if(!TeamId){
            return res.status(400).json({
                message: "Necessário informar o id do time."
            });
        }

        const owner = await Member.findOne({where: {UserId: UserId, TeamId: TeamId}});

        if(!owner || owner.role !== "owner"){
            return res.status(400).json({
                message: "Usuário sem permissão na equipe."
            });
        }
    
        // check if member exists
        const memberEmail = req.body.email;

        if(!memberEmail){
            return res.status(400).json({
                message: "Necessário informar o e-mail do membro"
            })
        }

        const member = await User.findOne({where: {email: memberEmail}});

        if(!member){
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }

        // check if member is in the team
        const checkMember = await Member.findOne({where: {UserId: member.id, TeamId: TeamId}});
        if(!checkMember){
            return res.status(400).json({
                message: "Este usuário não está nesta equipe."
            });
        }

        try {
            await Member.destroy({where: {UserId: member.id, TeamId: TeamId}});
            return res.status(200).json({
                message: "Usuário removido do time."
            });
        } 
        catch (error) {
            return res.status(500).json({
                message: "Ocorreu um erro. Tente novamente mais tarde."
            });
        }
    }
}