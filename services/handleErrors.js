const { forEach } = require("lodash");

module.exports.handleErrors = (err) => {
  let errors = {};
  if (err["code"] === 11000) {
    errors["email"] = "A user with this Email already Exists.";
  }
  // seperates the errors into email and password
  if (err.name == "ValidationError") {
    forEach(err["errors"], (key, val) => {
      errors[key["properties"].path] = key["properties"].message;
    });
  }

  return errors;
};
