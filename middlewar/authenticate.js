const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../utils/http-error");
require("dotenv").config();

const {SECRET_KEY} = process.env;

const authenticate = async(req, res, next) => {
    const {authorization} = req.headers;
    const [bearer, token] = authorization.split(" ");

    if(bearer !== "Bearer") {
        next(HttpError({status: 401}));
    }
    
    try {
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);

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