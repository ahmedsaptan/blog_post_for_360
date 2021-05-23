const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();

connectDB();
app.get("/", (req, res) => res.send("API Running"));

app.use("/api", require("./routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
