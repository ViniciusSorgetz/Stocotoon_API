const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const getDocodedToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, async (err, decodedToken) => {
            if(err){
                return reject(err);
            }
            resolve(decodedToken.id);
        });
    });
}

module.exports = getDocodedToken;