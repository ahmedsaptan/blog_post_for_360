const { body, query, param } = require("express-validator");
const { checkValidations } = require("../helpers/checkMethods");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
          // TODO:
        } catch (error) {}
      }),
    body("password")
      .exists()
      .withMessage("password is required")
      .bail()
      .notEmpty()
      .withMessage("password can't be empty")
      .bail()
      .length({ min: 6 })
      .withMessage("password min length is 6")
      .bail(),
  ];
};

const register = async (req, res, next) => {
  try {
    const body = checkValidations(req);

    const user = new User(body);

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();
  } catch (error) {
    next(e);
  }
};
