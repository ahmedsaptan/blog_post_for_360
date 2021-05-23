const { validationResult, matchedData } = require("express-validator");
const createError = require("http-errors");

const checkValidations = (req) => {
  const validationErrors = validationResult(req).array({
    onlyFirstError: true,
  });

  if (validationErrors.length > 0) {
    throw new createError(422, validationErrors[0].msg);
  }
  return matchedData(req);
};

module.exports = {
  checkValidations,
};
