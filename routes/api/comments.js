const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("comments route");
});

module.exports = router;
