const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const MONGODB_URI = process.env.MONGODB_URI;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  const status = typeof error.code === "number" ? error.code : 500;

  res.status(status).json({ message: error.message || "An error occured!" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(5000);
    console.log("mongodb server running on port 5000");
  })
  .catch((err) => {
    console.log(err);
  });
