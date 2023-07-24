const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
let { JWT_SECRET } = process.env;
module.exports.verifyToken = (token) =>
  new Promise(function (accept, reject) {
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        // console.log("DAta", decoded.email);
        accept(decoded);
      }
    });
  });
