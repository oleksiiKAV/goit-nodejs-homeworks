require("dotenv").config();
const jwt = require("jsonwebtoken");

const {SECRET_KEY} = process.env;

const generateJWT = ({payload, lifeTime}) => jwt.sign(payload, SECRET_KEY, {expiresIn: lifeTime});

module.exports = generateJWT;