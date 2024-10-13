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
            const checkName = await Page.findOne({where: {name: name, ChapterId: ChapterId}});
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
            const newPage = await Page.findOne({where: {name: name, ChapterId: ChapterId}});
            return res.status(201).json({
                message: "Página criada com sucesso.",
                page: newPage
            })        
        } 
        catch (error) {
            res.status(500).json({
                message: "Erro ao criar página. Tente novamente mais tarde."
            });
        }
    }

    static async edit(req, res){

        const { PageId } = req.params;
        const { name } = req.body;
        const page = await Page.findOne({where: {id: PageId}});

        if(!name || name.trim().length == 0){
            return res.status(400).json({
                message: "Necessário informar o nome da página."
            })
        }

        try {
            // verificar novo nome da página
            const checkPage = await Page.findOne({where: {name, ChapterId: page.ChapterId}});
            if(checkPage && checkPage.id != page.id){
                return res.status(400).json({
                    message: "Nome de página já em uso."
                });
            }
            const newPage = {name: name.trim()}
            await Page.update(newPage, {where: {id: PageId}});
            const updatedPage = await Page.findOne({where: {id: PageId}});
            return res.status(200).json({
                message: "Página editada com sucesso.",
                page: updatedPage
            });
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro ao editar página. Tente novamente mais tarde."
            })
        }
    }

}
