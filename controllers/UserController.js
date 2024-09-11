const User = require("../models/User");
const Team = require("../models/Team");
const Member = require("../models/Member");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const serviceAccount = require("../stocotoon-firebase-adminsdk-ssp44-45ef092961.json");
const admin = require("firebase-admin");
admin.initializeApp({
    storageBucket: "gs://stocotoon.appspot.com",
    credential: admin.credential.cert(serviceAccount)
});
const bucket = admin.storage().bucket();
const uuid = require("uuid-v4");

module.exports = class UserController {

    static async register(req, res){

        // check if there's missing information
        if(!req.body.name){
            return res.status(400).json({message: "Necessário preencher o nome."});
        }
        if(!req.body.email){
            return res.status(400).json({message: "Necessário preencher o e-mail."});
        }
        if(!req.body.password){
            return res.status(400).json({message: "Necessário preencher a senha."});
        }

        const name = req.body.name.trim();
        const email = req.body.email.trim();
        const password = req.body.password.trim();
        const confirmPassword = req.body.confirmPassword.trim();

        // check if email is already being used
        const checkUser = await User.findOne({where: {email: email}});
        if(checkUser){
            return res.status(409).json({message: "E-mail já em uso."});
        }

        // check if passwords match
        if(password !== confirmPassword){
            return res.status(400).json({message: "As senhas não batem."});
        }

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordhash = await bcrypt.hash(password, salt);

        // create user in db
        const user = {
            name, 
            email, 
            password: passwordhash
        }

        try {
            await User.create(user);
            res.status(201).json({message: "Usuário criado com sucesso!"});
            
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Erro ao criar o usuário. Tente novamente mais tarde."});
        }
    }

    static async login(req, res){

        const { email, password } = req.body;

        // check if there's missing information
        if(!email){
            return res.status(400).json({message: "Necessário preencher o e-mail."});
        }
        if(!password){
            return res.status(400).json({message: "Necessário preencher a senha."});
        }

        //check if user exists
        const user = await User.findOne({where: {email: email}});
        if(!user){
            return res.status(404).json({
                message: "Usuário não encontrado."
            })
        }

        // check password
        const checkPassword = await bcrypt.compare(String(password), String(user.password));
        if(!checkPassword){
            return res.status(401).json({
                message: "Senha inválida."
            })
        }

        // login
        try {
            const secret = process.env.SECRET;
            const token = jwt.sign({id: user.id}, secret);

            res.status(200).json({
                message: "Login realizado com sucesso.",
                name: user.name,
                id: user.id,
                token
            })
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro ao efetuar login. Tente novamente mais tarde."
            })
        }
    }

    static async edit(req, res){

        const { name } = req.body;
        const { UserId } = req.params;

        if(!name || name.trim().length === 0){
            return res.status(400).json({
                message: "Necessário preencher o nome."
            });
        }

        const checkName = await User.findOne({where: {name: name}});
        if(checkName && checkName.id != UserId){
            return res.status(400).json({
                message: "Nome de usuário já em uso."
            })
        }

        if(!req.file){
            await User.update({name}, {where: {id: UserId}});
            const updatedUser = await User.findOne({where: {id: UserId}});
            return res.status(200).json({
                message: "Nome do usuário editado com sucesso.",
                user: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            })
        }
        
        const metaData = {
            metaData: {
                firebaseStorageDownloadTokens: uuid()
            },
            contentType: req.file.mimetype,
            cacheControl: 'public, max-age=31536000'
        };
    
        const blob = bucket.file(new Date().getTime() + "." + req.file.originalname.split(".")[1]);
        const blobStream = blob.createWriteStream({
            metadata: metaData,
            gzip: true
        });
    
        blobStream.on("error", err => {
            return res.status(500).json({
                message: "Erro ao fazer upload da imagem. Tente novamente mais tarde."
            });
        });
    
        blobStream.on("finish", async () => {
            const imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media&token=`;
            await User.update({name, profilePictureURL: imageURL}, {where: {id: UserId}});
            const updatedUser = await User.findOne({where: {id: UserId}});
            return res.status(200).json({
                message: "Usuário editado com sucesso.",
                user: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    profilePictureURL: updatedUser.profilePictureURL
                }
            });
        });
    
        blobStream.end(req.file.buffer);
    }

    static async getInfo(req, res){

        const UserId = req.params.UserId;

        // check if user exists
        const user = await User.findOne({where: {id: UserId}, raw: true});
        if(!user){
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }
        const teamsId = await Member.findAll({where: {UserId: UserId}, raw: true});
        const teams = await Promise.all(
            teamsId.map(async ({TeamId}) => (
                Team.findOne({where: {id: TeamId}, raw: true})
            ))
        );
        const {id, name, email, createdAt, updatedAt} = user;
        return res.status(200).json({
            id,
            name,
            email,
            createdAt,
            updatedAt: user.updatedAt,
            teams: [...teams]
        });
    }
}
