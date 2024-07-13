const Chapter = require("../models/Chapter");
const Page = require("../models/Page");
const Picture = require("../models/Picture");
const Script = require("../models/Script");

module.exports = class PageController{
    
    static async create (req, res){
        
        const {ChapterId, name} = req.body;

        // check if there's missing information

        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário preencher o nome da página."
            });
        }
        try {
            const checkName = await Page.findOne({where: {name: name}});
            if(checkName){
                return res.status(400).json({
                    message: "Nome de página já em uso."
                });
            }
            const page = await Page.create({ChapterId, name});
            await Picture.create({
                PageId: page.id,
                content: {elements: "aqui terão os elements"}
            });
            await Script.create({
                PageId: page.id,
                content:{text: "aqui terá o conteúdo do roteiro"}
            });
            Script.create();

            res.status(201).json({
                message: "Página criada com sucesso."
            })        
        } catch (error) {
            res.status(500).json({
                message: "Erro ao criar página. Tente novamente mais tarde."
            })
        }
    }
}