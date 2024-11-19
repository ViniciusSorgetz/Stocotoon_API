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
            Script.create({PageId, name: name.trim(), content});
            res.status(201).json({
                message: "Roteiro criado com sucesso."
            })
            
        } catch (error) {
            res.status(500).json({
                message: "Erro ao criar roteiro. Tente novamente mais tarde."
            })
        }
    }

    static async getContent(req, res){
        try {
            const PageId = req.params.PageId;
            const script = await Script.findOne({where: {PageId: PageId}});
            res.status(200).json(script);
        } 
        catch (error) {
            console.log(error);
            res.json({
                message: "Erro ao buscar arquivo. Tente novamente mais tarde."
            });
        }
    }

    static async save(req, res){
        try {
            const {content, PageId} = req.body;
            const script = await Script.findOne({where: {PageId: PageId}});
            await Script.update({content: content}, {where: {id: script.id}});
            res.status(200).json({
                message: "Roteiro salvo com sucesso."
            })
        }
        catch (error) {
            console.log(error);
            res.json({
                message: "Erro ao buscar arquivo. Tente novamente mais tarde."
            });
        }
    }
}