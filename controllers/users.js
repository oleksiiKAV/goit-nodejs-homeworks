
const bcrypt = require("bcrypt");
const gravatar = require("gravatar")
const path = require("path");
const fs = require("fs/promises");
const User = require("../models/user");
const controllerWrap = require("../utils/controller-wrap");
const generateJWT = require("../utils/generateJWT");
const HttpError = require("../utils/http-error");
const resizeImg = require("../utils/resizeImg");
const { nanoid } = require("nanoid");
const sendVerifyingEmail = require("../utils/sendVerifyingEmail");

const uploadDir = path.join(__dirname, "..", "public", "avatars");

const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    
    if (user) {
        throw HttpError({status: 409, message: "Email in use"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);    
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, avatarUrl, password: hashedPassword, verificationToken,});

    console.log(newUser)

    await sendVerifyingEmail(newUser);


    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": newUser.subscription,
            "avatarUrl": newUser.avatarUrl
        }
    });
}

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});

    if (!user) {
        throw HttpError({status: 404, message: "User not found"});
    }    

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});
    res.json("Email verify success");

};

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});

    if (!user) {
        throw HttpError({status: 404, message: "User not found"});
    }

    if (user.verify) {
        throw HttpError({status: 401, message: "Verification has already been passed"});
    }

    await sendVerifyingEmail(user);

    res.json("Verification email sent");
};

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user) {
        throw HttpError({status: 401, message: "Email or password is wrong"});
    }

    if (!user.verify) {
        throw HttpError({status: 401, message: "Email is not verified"});
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        throw HttpError({status: 401, message: "Email or password is wrong"});
    }

    const token = generateJWT({payload: {id: user._id}, lifeTime: "1d"});
    await User.findByIdAndUpdate(user._id, {token});
    res.json({token, user : {email: user.email, subscription: user.subscription}});
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

const updAvatar = async(req, res) => {
    const {_id} = req.user;
    const {path: tempPath, filename} = req.file;
    await resizeImg({img: tempPath, size: {width: 250, height: 250}});
    const resultPath = path.join(uploadDir, filename);
    await fs.rename(tempPath, resultPath);
    const avatarUrl = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarUrl});

    res.json({avatarUrl});
}

module.exports = {
    register: controllerWrap(register),
    verifyEmail: controllerWrap(verifyEmail),
    resendVerifyEmail: controllerWrap(resendVerifyEmail),
    login: controllerWrap(login),
    getCurrent: controllerWrap(getCurrent),
    logOut: controllerWrap(logOut),
    updSubscription: controllerWrap(updSubscription),
    updAvatar: controllerWrap(updAvatar),
}