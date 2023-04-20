require('dotenv').config()
const env = process.env
const jwt = require("jsonwebtoken");
let accessToken = jwt.sign({id:'secret'}, process.env.TOKEN_SECRET_KEY /*, { 
    "algorithm": "HS256",
    expiresIn: '30s' 
}*/)
//console.log(accessToken)
const authSocketMiddleware = (socket, next) => {
  // since you are sending the token with the query

    const token = socket.handshake.query?.token;
    
    try {
        const decoded = jwt.verify(token, env.TOKEN_SECRET_KEY);
        socket.user = decoded;
        console.log(decoded)
    } catch (err) {

        return next(new Error("NOT AUTHORIZED"));
    }
    next();
};

module.exports = authSocketMiddleware;