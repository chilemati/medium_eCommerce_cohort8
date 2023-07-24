exports.get_home = (req, res) => {
  res.json({ home: "HomePage", jwt: req.cookies.jwt });
};
exports.get_test = (req, res) => {
  res.json({ hi: "Server says Hi" });
};
