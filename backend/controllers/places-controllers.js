const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const cloudinary = require("../util/cloudinary");

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

  if (!userPlaces || userPlaces.places.length === 0) {
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

  const { title, description, address } = req.body;
  if (!req.files || !req.files.image) {
    return next(new HttpError("No image uploaded", 422));
  }
  const imageFile = req.files.image;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(
      imageFile.tempFilePath,

      {
        folder: "places",
        width: 800,
        height: 600,
        crop: "fill",
      }
    );
  } catch (error) {
    return next(new HttpError("Image upload failed", 500));
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: uploadResult.secure_url,
    cloudinaryId: uploadResult.public_id,
    creatorId: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Creating place failed", 500));
  }
  if (!user) {
    const error = new HttpError("Could not find user for the provided id", 404);
    return next(error);
  }

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

  if (place.creatorId.toString() !== req.userData.userId) {
    return next(new HttpError("Not authorized!", 401));
  }
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("Could not update place", 500));
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

  if (place.creatorId.id !== req.userData.userId) {
    return next(new HttpError("Not Authorized!", 401));
  }

  const sess = await mongoose.startSession();
  try {
    if (place.cloudinaryId) {
      await cloudinary.uploader.destroy(place.cloudinaryId);
    }
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
