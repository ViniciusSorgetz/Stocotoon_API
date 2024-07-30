const Message = require("../models/Message");

module.exports = class MessageController{
    
    static async sendMessage(req, res){
        
        const {UserId, ChatId, content} = req.body;

        if(!content || content.trim().length === 0){
            return res.status(400).json({
                message: "Não é possível enviar uma mensagem vazia."
            });
        }

        try {
            await Message.create({UserId, ChatId, content});
            return res.status(200).json({
                message: "Mensagem enviada com sucesso!"
            })
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro ao enviar mensagem. Tente novamente mais tarde."
            })
        }

    }

}