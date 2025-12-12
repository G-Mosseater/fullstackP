const express = require("express");
const { check } = require("express-validator");
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", getPlaceById);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty().withMessage("Title is required"),
    check("description")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Description is not long enough"),
  ],
  updatePlace
);

router.delete("/:pid", deletePlace);

router.get("/user/:uid", getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty().withMessage("Title is required"),
    check("description")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Description is required"),
    check("address").not().isEmpty().withMessage("Address is required"),
  ],
  createPlace
);

module.exports = router;
