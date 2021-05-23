const express = require("express");
const router = express.Router();
const isvalidMongo = require("../../helpers/validateOnMongoIdParam");
const auth = require("../../middlewares/auth");
const {
  register,
  validateOnRegister,
  getUser,
} = require("../../controllers/user");

router.get("/", [auth], (req, res) => {
  res.send("users route");
});
router.get("/:id", [isvalidMongo(), auth], getUser);

router.post("/", [validateOnRegister()], register);

module.exports = router;
