const cloudinary = require('./util/cloudinary.js')
const testConnection = async () => {
  try {
    // List 1 image from your account to test connection
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log("Cloudinary connection successful!");
    console.log("Sample image:", result.resources[0]?.secure_url);
  } catch (error) {
    console.error("Cloudinary connection failed:", error.message);
  }
};

testConnection();