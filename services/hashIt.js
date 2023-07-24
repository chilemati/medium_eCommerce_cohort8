const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
let { BCRYPT_SALT } = process.env;
exports.hashIt = (text) =>
  new Promise(function (accept, reject) {
    bcrypt.hash(text, Number(BCRYPT_SALT), (err, hash) => {
      if (err) {
        reject(err);
      } else {
        accept(hash);
      }
    });
  });
