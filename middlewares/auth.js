const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    throw createHttpError(401, "No token, authorization denied");
  }

  try {
    const token = bearerToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        throw createHttpError(401, "Token is not valid");
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(500, "Server Error");
  }
};
