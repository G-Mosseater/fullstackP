const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a place", 500)
    );
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // let places;
  let userPlaces;
  try {
    userPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(new HttpError("Fetching places failed", 500));
  }

  if (!userPlaces || userPlaces.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id", 404)
    );
  }
  res.json({
    places: userPlaces.places.map((p) => p.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Something went wrong", 422));
  }

  const { title, description, address, creatorId } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://images.everydayhealth.com/images/diet-nutrition/bananas-nutrition-facts-1440x810.jpg?sfvrsn=5e5dc687_3",
    creatorId,
  });
  let user;

  try {
    user = await User.findById(creatorId);
  } catch (error) {
    return next(new HttpError("Creating place failed", 500));
  }
  if (!user) {
    const error = new HttpError("Could not find user for the provided id", 404);
    return next(error);
  }
  console.log(user);

  const sess = await mongoose.startSession();

  try {
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace._id);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    await sess.abortTransaction();
    return next(new HttpError("Creating place failed", 500));
  }

  res.status(201).json({ message: "Place created", createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Something went wrong", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Could not update place", 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("Could not not update place", 500));
  }

  res.status(200).json({
    message: "Place updated",
    place: place.toObject({ getters: true }),
  });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creatorId");
  } catch (error) {
    return next(new HttpError("Could not delete place", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find a place for this id", 404));
  }

  const sess = await mongoose.startSession();

  try {
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creatorId.places.pull(place._id);
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    await sess.abortTransaction();
    return next(new HttpError("Could not delete place", 500));
  }
  res.status(200).json({ message: "Place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
