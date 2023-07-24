const { verifyToken } = require("../services/verifyToken");

module.exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    let verified = await verifyToken(req.cookies.jwt);
    if (verified) {
      //   console.log("from verided: ", verified.email);
      next();
    } else {
      res.json({ login: "Wrong Token" });
    }
  } else {
    res.json({ login: "Please login from isLoggedIn middleware" });
  }
};
