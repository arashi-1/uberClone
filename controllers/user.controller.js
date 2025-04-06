const userModel = require("../models/users.models");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const BlacklistToken=require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { fullname, email, password } = req.body;
  const hashedPassword = await userService.hashPassword(password);
  const user = await userService.createUser({
    firstName: fullname.firstName,
    lastName: fullname.lastName,
    email,
    password: hashedPassword,
  });

  const token = await userService.generateToken(user);
  res.status(201).json({ token, user });
};
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isMatch = await userService.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = await userService.generateToken(user);
  res.cookie("token", token);
  res.status(200).json({ token, user });
}
module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};
module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  await BlacklistToken.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};
