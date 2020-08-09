const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

const uploadImage = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.uploader.upload(file.path);
    fs.unlink(file.path, () => {});
    return result.url;
  } catch (e) {
    return null;
  }
};

module.exports = { uploadImage };
