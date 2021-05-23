const { param } = require("express-validator");

const validateParamIdMongoId = () => {
  return [
    param("id")
      .exists()
      .withMessage("id is required")
      .bail()
      .notEmpty()
      .withMessage("id can't be empty")
      .bail()
      .isMongoId()
      .withMessage("id not mongo Id"),
  ];
};

module.exports = validateParamIdMongoId;
