const Team = require("../models/Team");
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const Page = require("../models/Page");
const Member = require("../models/Member");
const User = require("../models/User");
const Chat = require("../models/Chat");

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
        
        const team = {
            UserId,
            name: name.trim(),
            description: description ? description.trim() : null,
        }

        try {
            const createdTeam = await Team.create(team);
            await Member.create({
                UserId, 
                TeamId: createdTeam.id,
                role: "owner"
            });
            await Chat.create({
                name: "Chat01",
                TeamId: createdTeam.id
            })
            res.status(201).json({
                message: "Equipe criada com sucesso!",
                team: createdTeam
            });
        } 
        catch (error) {
            res.status(500).json({
                message: "Ocorreu um erro. Tente novamente mais tarde."
            });
            console.log(error);
        }
    }

    static async getInfo(req, res){

        const TeamId = req.params.TeamId;
        const team = await Team.findOne({where: {id: TeamId}, raw: true});

        const stories = await Story.findAll({where: {TeamId: TeamId}});
        const chats = await Chat.findAll({where: {TeamId: TeamId}});
        return res.status(200).json({
            ...team,
            stories: [...stories],
            chats: [...chats]
        });
    }

    static async edit(req, res){
        
        const {TeamId} = req.params;
        console.log(`TeamID ------- ${TeamId}`);

        // check token and if token's user has "owner" role
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const UserId = await getDocodedToken(token);
        const owner = await Member.findOne({where: {UserId: UserId, TeamId: TeamId}, raw: true});
        if(!owner || owner.role !== "owner"){
            return res.status(400).json({
                message: "Usuário sem permissão na equipe."
            });
        }

        const {name, description} = req.body;
        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário preencher o nome da equipe."
            });
        }
        const checkName = await Team.findOne({where: {name: name}});
        if(checkName && checkName.id != TeamId){
            return res.status(400).json({
                message: "Nome da história já em uso."
            });
        }

        const team = {
            UserId,
            name: name.trim(),
            description: description ? description.trim() : null,
        }

        try {
            await Team.update(team, {where: {id: TeamId}});
            const updatedTeam = await Team.findOne({where: {id: TeamId}});
            return res.status(200).json({
                message: "Equipe editada com sucesso!",
                team: updatedTeam
            })
        } 
        catch (error) {
            return res.status(500).json({
                message: "Algo deu errado ao editar equipe. Tente novamente mais tarde."
            });
        }
    }

    static async addMember (req, res){

        const TeamId = req.body.TeamId;
        if(!TeamId){
            return res.status(400).json({
                message: "Necessário informar o id do time."
            });
        }

        // check token and if token's user has "owner" role
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const UserId = await getDocodedToken(token);
        const owner = await Member.findOne({where: {UserId: UserId, TeamId: TeamId}, raw: true});
        
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

    static async getAllInfo(req, res){

        const {TeamId} = req.params;
        try {
            // get all members information
            const membersId = await Member.findAll({where: {TeamId: TeamId}});
            const membersList = await Promise.all(membersId.map(async memberId => {
                const member = await User.findOne({where: {id: memberId.UserId}, raw: true});
                return {
                    name: member.name,
                    email: member.email,
                    role: memberId.role
                }
            }));
            const owners = membersList.filter(member => member.role === "owner");
            const members = membersList.filter(member => member.role === "member");

            // get amount of stories, chapters and pages information
            const stories = await Story.findAll({where: {TeamId: TeamId}});
            let chapters = await Promise.all(stories.map(async story => {
                return await Chapter.findAll({where: {StoryId: story.id}});
            }));
            chapters = [].concat.apply([], chapters)

            let pages = await Promise.all(chapters.map(async chapter => {
                return await Page.findAll({where: {ChapterId: chapter.id}});
            }));
            pages = [].concat.apply([], pages);
            
            // get team information
            const team = await Team.findOne({where: {id: TeamId}, raw: true});

            return res.status(200).json({
                ...team,
                amount: {
                    stories: stories.length,
                    chapters: chapters.length,
                    pages: pages.length
                },
                members: {
                    owners: [...owners],
                    members: [...members]
                }
            });
        } 
        catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar membros da equipe, tente novamente mais tarde."
            })
        }
    }
}