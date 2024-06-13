const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

    static async getUser(req, res){

        const id = req.params.id;

        // check if user exists
        const user = await User.findOne({where: {id: id}}, {raw: true});
        if(!user){
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }
        res.status(200).json({user});
    }

}
