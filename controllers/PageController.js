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
                content: {
                    layers: [
                      {
                        name: "Layer-1",
                        id: 1,
                        elements: [],
                        hidden: false
                      }
                    ],
                    selectedLayer: {
                      name: "Layer-1",
                      id: 1,
                      elements: [],
                      hidden: false
                    },
                    layerIndex: 0,
                    layersQty: 1,
                }
            });
            await Script.create({
                PageId: page.id,
                content: {text: "aqui terá o conteúdo do roteiro"}
            });

            return res.status(201).json({
                message: "Página criada com sucesso."
            })        
        } 
        catch (error) {
            res.status(500).json({
                message: "Erro ao criar página. Tente novamente mais tarde."
            });
        }
    }

    static async list(req, res){

        try {
            const ChapterId = req.params.ChapterId;
            const pages = await Page.findAll({where: {ChapterId: ChapterId}, raw: true});
            res.status(200).json(pages);
        } 
        catch (error) {
            res.status(500).json({
                message: "Erro ao listar páginas. Tente novamente mais tarde."
            });
        }
    }
}