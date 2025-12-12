const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "test1234",
  },
  {
    id: "u2",
    name: "Mark Stevens",
    email: "mark@example.com",
    password: "mypassword",
  },
  {
    id: "u3",
    name: "Juan Carlos",
    email: "juan@example.com",
    password: "secretpass",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};
const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Something went wrong, could not create user", 422)
    );
  }
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    return next(new HttpError("User already exists", 422));
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ message: "User created", user: createdUser });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Could not find user", 401));
  }
  res.json({ message: "logged in" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
