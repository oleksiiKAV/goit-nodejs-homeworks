const HttpError = require("../utils/http-error");
const controllerWrap = require("../utils/controller-wrap");
const Contact = require("../models/contacts");

const getContactsList = async (req, res) => {
    try {
        res.json(await Contact.find());
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findById(contactId);
        if (!result) {
            throw HttpError({ status: 404, message: "Not found" });
        }
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Server error" });
    }
}

const addContact = async (req, res) => {
    try {
        const result = await Contact.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findByIdAndRemove(contactId);
        if (!result) {
            throw HttpError({ status: 404, message: "Not found" });
        }
        res.json({ message: "contact deleted" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Server error" });
    }
}

const updateContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
        if (!result) {
            throw HttpError({ status: 404, message: "Not found" });
        }
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Server error" });
    }
}

const updateFavorite = async (req, res) => {
    try {
        if (!Object.keys(req.body).length) {
            throw HttpError({ status: 400, message: "missing field favorite" });
        }
        const { contactId } = req.params;
        const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
        if (!result) {
            throw HttpError({ status: 404, message: "Not found" });
        }
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Server error" });
    }
};

module.exports = {
    getContactsList: controllerWrap(getContactsList),
    getContact: controllerWrap(getContact),
    addContact: controllerWrap(addContact),
    updateContact: controllerWrap(updateContact),
    deleteContact: controllerWrap(deleteContact),
    updateFavorite: controllerWrap(updateFavorite),
};
