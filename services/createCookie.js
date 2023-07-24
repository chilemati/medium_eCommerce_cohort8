module.exports.createCookie = (res, token, exp) => {
  res.cookie("jwt", token, {
    maxAge: exp,
    // httpOnly: true,
    // secure: true,
    // SameSite: None,
  });
};
