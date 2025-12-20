const dotenv = require("dotenv");

dotenv.config(); 
const cloudinary = require("cloudinary").v2;

console.log("CLOUD_NAME:", process.env.CLOUD_NAME);


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, 
});

module.exports = cloudinary;
