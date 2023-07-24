const { verifyToken } = require("../services/verifyToken");

module.exports.admin_subadmin_only = async (req, res, next) => {
  if (req.cookies.jwt) {
    let verified = await verifyToken(req.cookies.jwt);
    if (verified.role === "admin" || verified.role === "subAdmin") {
      //   console.log("from verided: ", verified.email);
      next();
    } else {
      res.json({ login: "Only admin and subAdmin has access!" });
    }
  } else {
    res.json({ login: "Please login from isLoggedIn middleware" });
  }
};
