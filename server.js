require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const chalk = require("chalk");
const morgan = require("morgan");
const createError = require("http-errors");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.enable("trust proxy");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "uploads/admin")));

connectDB();

app.get("/", (req, res) => res.send("API Running"));

app.use("/api", require("./routes"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// ERROR Handler
app.use((err, req, res, next) => {
  console.log(chalk.red.bgYellowBright("SERVER LOGGED ERROR:\n"), err);
  res.status(err.status || 500).json({
    message: Array.isArray(err.message) ? err.message[0].msg : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
