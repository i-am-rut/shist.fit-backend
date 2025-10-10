const jwt = require("jsonwebtoken");

const generateEmailToken = (email) => {
  return jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: "1d" });
};

const verifyEmailToken = (token) => {
  return jwt.verify(token, process.env.EMAIL_SECRET);
};

module.exports = { generateEmailToken, verifyEmailToken };
