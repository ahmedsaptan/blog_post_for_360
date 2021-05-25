const createHttpError = require("http-errors");
const User = require("../models/User");
const { body } = require("express-validator");
const { checkValidations } = require("../helpers/checkMethods");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateonLoginuser = () => {
  return [
    body("email")
      .exists()
      .withMessage("email is required")
      .bail()
      .notEmpty()
      .withMessage("email can't be empty")
      .bail()
      .isEmail()
      .withMessage("email is not valid")
      .bail()
      .custom(async (value, { req }) => {
        try {
          const existUser = await User.findOne({ email: value });
          if (!existUser) {
            throw createHttpError(400, "email not found");
          }
          req.existUser = existUser;
          return true;
        } catch (error) {
          throw error;
        }
      }),
    body("password")
      .exists()
      .withMessage("password is required")
      .bail()
      .notEmpty()
      .withMessage("password can't be empty")
      .bail()
      .isLength({ min: 6 })
      .withMessage("password min length is 6")
      .bail(),
  ];
};

const getCurrentUser = async (req, res, next) => {
  try {
    // debugger;
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      throw createHttpError(400, "user not found");
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res, next) => {
  try {
    const body = checkValidations(req);

    const user = req.existUser;

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      throw createHttpError(400, "user not found");
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

module.exports = { getCurrentUser, validateonLoginuser, loginUser };
