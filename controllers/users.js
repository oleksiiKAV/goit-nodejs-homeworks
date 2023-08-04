const bcrypt = require("bcrypt");

const User = require("../models/user");
const controllerWrap = require("../utils/controller-wrap");
const generateJWT = require("../utils/generateJWT");
const HttpError = require("../utils/http-error");

const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    
    if (user) {
        throw HttpError({status: 409, message: "Email in use"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashedPassword});

    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": "starter"
        }
    });
}

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user) {
        throw HttpError({status: 401, message: "Email or password is wrong"});
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        throw HttpError({status: 401, message: "Email or password is wrong"});
    }

    const token = generateJWT({payload: {id: user._id}, lifeTime: "1d"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({token});
    
}

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;

    res.json({email, subscription});
}

const logOut = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Logout success"
    })
}

const updSubscription = async(req, res) => {
    res.json(await User.findByIdAndUpdate(req.user._id, req.body, {new: true}));
}

module.exports = {
    register: controllerWrap(register),
    login: controllerWrap(login),
    getCurrent: controllerWrap(getCurrent),
    logOut: controllerWrap(logOut),
    updSubscription: controllerWrap(updSubscription),
}