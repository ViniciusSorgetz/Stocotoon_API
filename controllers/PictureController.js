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
}