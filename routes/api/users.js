const express = require("express");
const controller = require("../../controllers/users");
const authenticate = require("../../middlewar/authenticate");
const validateBody = require("../../middlewar/validate-body");
const { registerSchema, loginSchema, updateSubscriptionSchema } = require("../../utils/validation");

const router = express.Router();

router.post("/register", validateBody(registerSchema), controller.register);

router.post("/login", validateBody(loginSchema), controller.login);

router.get("/current", authenticate, controller.getCurrent);

router.post("/logout", authenticate, controller.logOut);

router.patch("/subscription", authenticate, validateBody(updateSubscriptionSchema),controller.updSubscription);

module.exports = router;