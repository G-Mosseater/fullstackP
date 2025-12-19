const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const { getUsers, login, signUp } = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", getUsers);

router.post("/login", login);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Please enter a valid email."),
    check("password").isLength({ min: 6 }),
  ],
  signUp
);

module.exports = router;
