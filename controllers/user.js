const { body, query, param } = require("express-validator");
const { checkValidations } = require("../helpers/checkMethods");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

const validateOnRegister = () => {
  return [
    body("name")
      .exists()
      .withMessage("name is required")
      .bail()
      .notEmpty()
      .withMessage("name can't be empty"),
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
          if (existUser) {
            throw createHttpError(404, "User Already Exists");
          }
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

const register = async (req, res, next) => {
  try {
    const body = checkValidations(req);

    const user = new User(body);
    // debugger;
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(body.password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) {
          console.log(err);
          throw err;
        }
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const user = await (await User.findById(body.id)).select("-password");
    if (!user) {
      throw createHttpError(400, "user not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateOnRegister,
  register,
  getUser,
};
