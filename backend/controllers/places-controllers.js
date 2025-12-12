const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const id = uuidv4();
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
let DUMMY_PLACES = [
  {
    id: "p1",
    imageUrl: "https://picsum.photos/300",
    title: "Beautiful Waterfall",
    description: "A calm and peaceful place in nature.",
    address: "123 Nature Road, Iceland",
    creatorId: "u1",
    location: { lat: 64.1466, lng: -21.9426 },
  },
  {
    id: "p2",
    imageUrl: "https://picsum.photos/301",
    title: "Cozy Mountain Cabin",
    description: "A perfect retreat surrounded by mountains.",
    address: "456 Mountain Path, Iceland",
    creatorId: "u1",
    location: { lat: 64.1466, lng: -21.9426 },
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creatorId === userId);
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id", 404)
    );
  }
  res.json({ places });
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

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creatorId,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ message: "Place createde", createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Something went wrong", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ message: "Place updated", updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    return next(new HttpError("Could not find place for that id", 404));
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
