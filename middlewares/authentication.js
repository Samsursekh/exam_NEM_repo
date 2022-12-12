const { rmSync } = require('fs');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const authentication = (req,res,next) => {
    const token = req.headers?.authentication?.split(" ")[1];
    if(!token){
        res.send("PLEASE LOGIN");
    }
    const decoder = jwt.verify(token.process.env.SECRET_KEY);
    const user_id = decoder.user_id;
    if(decoder){
        req.body.user_id = user_id;
        next();
    }
    else{
        res.send("LOGIN PLEASE");
    }
}

module.exports = {authentication};


