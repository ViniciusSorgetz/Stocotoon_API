require("dotenv").config();
const User = require("../models/User");

const getDcodedToken = require("../utils/getDecodedToken");

module.exports = async function checkTokenByUser(req, res, next){

    let UserId = req.body.UserId;
    if(!UserId)
        UserId = Number(req.params.UserId);

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Acesso negado"
        });
    }

    const decodedToken = await getDcodedToken(token);

    if (decodedToken !== UserId) {
        return res.status(400).json({
            message: "Token de usuário inválido."
        });
    }
    else{
        next();
    }
}