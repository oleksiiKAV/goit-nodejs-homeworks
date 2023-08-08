const Joi = require("joi");

const NUMBER_REGEXP = /\+?\d{1,4}?[-\d\s]?\(?\d{1,3}?\)?[-\d\s]?\d{1,4}[-\d\s]?\d{1,4}[-\d\s]?\d{1,9}/;
const NUMBERS_ONLY_REGEXP = /^\+?[\d\s-()]*$/;
const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validation = {
    addSchema: Joi.object({
        name: Joi.string().min(3).trim().required(),
        email: Joi.string().pattern(EMAIL_REGEXP).trim().required(),
        phone: Joi.string().pattern(NUMBER_REGEXP, {name: "valid phone number"}).pattern(NUMBERS_ONLY_REGEXP, {name: "numbers and special symbols"}).trim().required(),
        favorite: Joi.bool(),
    }),

    updateSchema: Joi.object({
        name: Joi.string().min(3).trim(),
        email: Joi.string().pattern(EMAIL_REGEXP).trim(),
        phone: Joi
            .string()
            .pattern(NUMBER_REGEXP, {name: "valid phone number"})
            .pattern(NUMBERS_ONLY_REGEXP, {name: "numbers and special symbols"}).trim(),
        favorite: Joi.bool(),
}).min(1),
    
    updateFavorite: Joi.object({
        favorite: Joi.bool().required().messages({"any.required": "missing field favorite"}),
    }).max(1),

    registerSchema: Joi.object ({
        email: Joi.string().pattern(EMAIL_REGEXP).required(),
        password: Joi.string().min(6).required(),
    }),

    loginSchema: Joi.object ({
        email: Joi.string().pattern(EMAIL_REGEXP, {name: "invalid email"}).required(),
        password: Joi.string().min(6).required(),
    }),

    updateSubscriptionSchema: Joi.object({
        subscription: Joi.string().valid("starter", "pro", "business").required().messages({"any.only": "The subscription must have one of the following values ['starter', 'pro', 'business']"}),
    }).max(1),
};

module.exports = validation;