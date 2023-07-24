const bcrypt = require("bcrypt");
exports.compareIt = (plainP, hashedP) =>
  new Promise(function (accept, reject) {
    bcrypt.compare(plainP, hashedP, (err, result) => {
      if (err) {
        reject(err);
      } else {
        accept(result);
      }
    });
  });
