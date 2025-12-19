const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");
require("dotenv").config();

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Fetching users failed", 500));
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Something went wrong, could not create user", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Creating new user failed", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exists", 422));
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Creating new user failed", 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed", 500);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "30d" }
    );
  } catch (error) {
    return next(new HttpError("Creating new user failed", 500));
  }

  res.status(201).json({
    message: "User created",
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Logging in failed", 500));
  }
  if (!existingUser) {
    return next(new HttpError("Invalid credentials", 401));
  }
  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Logging in failed, check credentials", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials", 403));
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Logging in failed", 500));
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
