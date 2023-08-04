const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../utils/http-error");
require("dotenv").config();

const {SECRET_KEY} = process.env;
// console.log(SECRET_KEY)
const authenticate = async(req, res, next) => {
    const {authorization} = req.headers;
    const [bearer, token] = authorization.split(" ");

    if(bearer !== "Bearer") {
        next(HttpError({status: 401}));
    }
    
    try {
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        // console.log(user.token)
        // console.log("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2QwYjNjN2M5OWY1ZjFjZTllMTA1ZSIsImlhdCI6MTY5MTE2MTE5MSwiZXhwIjoxNjkxMjQ3NTkxfQ.nzZZ6lKUj-KUwsZMZnFk-GA3QrA8vJ0HFWU0zny8rGM")
        if(!user || !user.token || user.token !== token) {
            next(HttpError({status: 401}));
        }        
        req.user = user;
        next();        
    } 
    catch {
        next(HttpError({status: 401}));
    }
}

module.exports = authenticate;