const Script = require("../models/Script");
const Page = require("../models/Page");

module.exports = class ScriptController{
    
    static async create (req, res){
        
        const {PageId, name, content} = req.body;

        // check if there's missing information
        if(!name){
            return res.status(400).json({
                message: "Necessário preencher o nome do roteiro."
            });
        }

        try {
            Script.create({PageId, name, content});
            res.status(201).json({
                message: "Roteiro criado com sucesso."
            })
            
        } catch (error) {
            res.status(500).json({
                message: "Erro ao criar roteiro. Tente novamente mais tarde."
            })
        }
    }
}