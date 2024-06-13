const Page = require("../models/Page");

module.exports = class PageController{
    
    static async create (req, res){
        
        const {ChapterId, name} = req.body;

        // check if there's missing information
        if(!name){
            return res.status(400).json({
                message: "Necessário preencher o nome do page."
            });
        }

        try {
            Page.create({ChapterId, name});
            res.status(201).json({
                message: "Page criado com sucesso."
            })
            
        } catch (error) {
            res.status(500).json({
                message: "Erro ao criar page. Tente novamente mais tarde."
            })
        }
    }
}