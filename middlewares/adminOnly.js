const { verifyToken } = require("../services/verifyToken");

module.exports.adminOnly = async (req, res, next) => {
  if (req.cookies.jwt) {
    let verified = await verifyToken(req.cookies.jwt);
    if (verified.role === "admin") {
      //   console.log("from verided: ", verified.email);
      next();
    } else {
      res.json({ login: "Only admin has access!" }); //err:
    }
  } else {
    res.json({ login: "Please login from isLoggedIn middleware" });
  }
};
