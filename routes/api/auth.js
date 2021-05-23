const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  validateonLoginuser,
  loginUser,
} = require("../../controllers/auth");
const auth = require("../../middlewares/auth");
router.get("/", [auth], getCurrentUser);
router.post("/", [validateonLoginuser()], loginUser);

module.exports = router;
