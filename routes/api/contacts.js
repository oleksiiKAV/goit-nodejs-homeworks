const authenticate = require("../../middlewar/authenticate")
const controller = require("../../controllers/contacts")
const express = require("express");
const validateBody = require("../../middlewar/validate-body");
const { addSchema, updateSchema, updateFavorite } = require("../../utils/validation");
const isValidId = require("../../middlewar/is-valid-id");

const router = express.Router();

router.get("/", authenticate, controller.getContactsList);

router.get("/:contactId", authenticate, isValidId, controller.getContact);

router.post("/", authenticate, validateBody(addSchema), controller.addContact);

router.delete("/:contactId", authenticate, isValidId, controller.deleteContact);

router.put("/:contactId", authenticate, isValidId, validateBody(updateSchema), controller.updateContact);

router.patch("/:contactId/favou?rite", authenticate, isValidId, validateBody(updateFavorite), controller.updateFavorite);

module.exports = router;
