const express = require("express");

const contactsModel = require("../../models/contacts");
const { validateBody } = require("../../middlewares/middleware");
const {
  schemaCreateContact,
  schemaUpdateContact,
} = require("./contacts-validation-schema");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsModel.listContacts();
    res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactsModel.getContactById(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    const error = new Error("Not found");
    error.statusCode = 404;
    throw error;
  } catch (error) {
    next(error);
  }
});

router.post("/", validateBody(schemaCreateContact), async (req, res, next) => {
  try {
    const newContact = await contactsModel.addContact(req.body);
    if(!newContact){
      const error = new Error("missing fields");
        error.statusCode = 400;
        throw error;
    }
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const deletedContact = await contactsModel.removeContact(
      req.params.contactId
    );
    if (!deletedContact) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    return res.json({ status: "success", code: 200, message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});


router.put(
  "/:id",
  validateBody(schemaUpdateContact),
  async (req, res, next) => {
    try {
      const contactId = req.params.id;
      const body = req.body;

   
      if (!body || Object.keys(body).length !== 3) {
        const error = new Error("missing fields");
        error.statusCode = 400;
        throw error;
      }

      const updatedContact = await contactsModel.updateContact(contactId, body);

      if (!updatedContact) {
        const error = new Error("Not found");
        error.statusCode = 404;
        throw error;
      }

      return res
        .status(200)
        .json({ status: "success", code: 200, data: { updatedContact } });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
