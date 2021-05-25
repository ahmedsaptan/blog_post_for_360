const express = require("express");
const router = express.Router();
const isValidMongo = require("../../helpers/validateOnMongoIdParam");
const auth = require("../../middlewares/auth");
const {
  register,
  validateOnRegister,
  getUser,
} = require("../../controllers/user");

router.get("/:id", [isValidMongo(), auth], getUser);

router.post("/", [validateOnRegister()], register);

module.exports = router;
