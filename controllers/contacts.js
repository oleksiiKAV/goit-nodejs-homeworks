const HttpError = require("../utils/http-error");
const controllerWrap = require("../utils/controller-wrap");
const Contact = require("../models/contacts");
const getIdAndOwnerQuery = require("../utils/getQueryFromId");

const getContactsList = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 20, favorite = null} = req.query;
    const skip = (page - 1) * limit;
    const query = {owner};
    favorite !== null && (query.favorite = favorite);
    res.json(await Contact.find(query, "", {skip, limit}).populate("owner", "email"));
}

const getContact = async (req, res) => {
    const query = getIdAndOwnerQuery(req);
    const result = await Contact.findOne(query).populate("owner", "email");
    if(!result) {
        throw HttpError({status: 404});
    }
    res.json(result);
}

const addContact = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
}

const deleteContact = async (req, res) => {
    const query = getIdAndOwnerQuery(req);
    const result = await Contact.findOneAndRemove(query);
    if (!result) {
      throw HttpError({status: 404});
    }
    res.json({ message: "contact deleted" });
}

const updateContact = async (req, res) => {
    const query = getIdAndOwnerQuery(req);
    const result = await Contact.findOneAndUpdate(query, req.body, {new: true});
    if (!result) {
      throw HttpError({status: 404});
    }
    res.json(result);
}

const updateFavorite = async (req, res) => {
    const query = getIdAndOwnerQuery(req);
    const result = await Contact.findOneAndUpdate(query, req.body, {new: true});
    if (!result) {
      throw HttpError({status: 404});
    }
    res.json(result);
};

module.exports = {
    getContactsList: controllerWrap(getContactsList), 
    getContact: controllerWrap(getContact), 
    addContact: controllerWrap(addContact), 
    updateContact: controllerWrap(updateContact), 
    deleteContact: controllerWrap(deleteContact),
    updateFavorite: controllerWrap(updateFavorite),
};