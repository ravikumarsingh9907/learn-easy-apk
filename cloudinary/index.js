const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function uploadOnCloud(folder, image) {
  return await new Promise((resolve) => {
    const options = {
      folder: folder,
    };

    cloudinary.uploader.upload_stream(options, (error, uploadResult) => {
      return resolve(uploadResult);
    }).end(image);
  });
}

async function removeFromCloud(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}

module.exports = {
  cloudinary,
  uploadOnCloud,
  removeFromCloud,
};
