const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

module.exports = class ChatController{
    
    static async create(req, res){

        const {name, description, TeamId} = req.body;

        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário informar o nome do chat."
            });
        }
        const checkChat = await Chat.findOne({where: {name: name}});
        if(checkChat){
            return res.status(400).json({
                message: "Nome do chat já em uso."
            });
        }

        try {
            await Chat.create({name: name.trim(), description: description.trim(), TeamId});
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
            const updatedMessages = await Promise.all(messages.map(async message => {
                const user = await User.findOne({where: {id: message.UserId}, raw: true});
                return {
                    id: message.id,
                    nick: user.name,
                    content: message.content,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt
                }
            }));
            return res.status(200).json({
                ...chat,
                messages: [...updatedMessages]
            });
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro ao listar mensagens. Tente novamente mais tarde."
            })
        }
    }

}