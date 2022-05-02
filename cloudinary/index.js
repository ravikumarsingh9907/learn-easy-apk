const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Courses",
  },
});

const storage2 = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Categories",
  },
});

module.exports = {
  cloudinary,
  storage,
  storage2,
};
