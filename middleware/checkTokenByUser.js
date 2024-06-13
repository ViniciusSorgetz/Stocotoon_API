require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function checkTokenByUser(req, res, next){

    const UserId = req.body.UserId;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Acesso negado"
        });
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret, async (err, decodedToken) => {
            if (err) {
                return res.status(400).json({
                    message: "Token inválido."
                });
            }
            if (decodedToken.id !== UserId) {
                return res.status(400).json({
                    message: "Token de usuário inválido."
                });
            }
            else{
                next();
            }
        });

    } catch (error) {
        res.status(400).json({
            message: "Token inválido."
        })
    }
}