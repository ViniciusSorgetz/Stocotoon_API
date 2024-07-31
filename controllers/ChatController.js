const Chat = require("../models/Chat");
const Message = require("../models/Message");

module.exports = class ChatController{
    
    static async create(req, res){

        const {name, description, TeamId} = req.body;

        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário informar o nome do chat."
            });
        }

        try {
            await Chat.create({name, description, TeamId});
            return res.status(200).json({
                message: "Chat criado com sucesso!"
            })
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro ao criar chat. Tente novamente mais tarde."
            })
        }
    }

    static async getInfo(req, res){

        const { ChatId } = req.params;
        try {
            const chat = await Chat.findOne({where: {id: ChatId}, raw: true});
            const messages = await Message.findAll({where: {ChatId: ChatId}, raw: true});
            return res.status(200).json({
                ...chat,
                messages: [...messages]
            });
        } 
        catch (error) {
            return res.status(500).json({
                message: "Erro ao listar mensagens. Tente novamente mais tarde."
            })
        }
    }

}