const Picture = require("../models/Picture");
const Page = require("../models/Page");

module.exports = class PictureController{

    static async create(req, res){

        const PageId = req.body.PageId;
        const page = await Page.findOne({where: {id: PageId}});

        if(!page){
            res.json({
                message: "Page não encontrado."
            });
            return;
        }

        try {
            const picture = {
                name: req.body.name,
                src: req.page.path,
                PageId,
            };

            await Picture.create(picture);

            res.json({
                message: "Arquivo criado com sucesso!"
            })

        } catch (error) {
            console.log(error);
            res.json({
                message: "Erro ao criar arquivo"
            });
        }
    }

    static async getContent(req, res){
        try {
            const PageId = req.params.PageId;
            const picture = await Picture.findOne({where: {PageId: PageId}});
            res.status(200).json(picture);
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
            const picture = await Picture.findOne({where: {PageId: PageId}});
            await Picture.update({content: content}, {where: {id: picture.id}});
            res.status(200).json({
                message: "Página salva com sucesso."
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