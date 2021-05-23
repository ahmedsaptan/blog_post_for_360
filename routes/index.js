const express = require("express");
const router = express.Router();


router.use("/users", require("./api/users"));

router.use("/auth", require("./api/auth"));
router.use("/posts", require("./api/posts"));
router.use("/comments", require("./api/comments"));

module.exports = router;
