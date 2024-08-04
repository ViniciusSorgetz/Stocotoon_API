const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.SECRET;

const verifyToken = async (token, ChatId) => {
    return true;
    jwt.verify(token, secret, async (err, decodedToken) => {   
        console.log(token, ChatId) 
        try {
            const UserId = decodedToken.id;
            const chat = await Chat.findOne({where: {id: ChatId}});
            const checkMember = await Member.findOne({where: {TeamId: chat.TeamId, UserId: UserId}});
            if(checkMember){
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            return false;
        }
    });
}

module.exports = verifyToken;