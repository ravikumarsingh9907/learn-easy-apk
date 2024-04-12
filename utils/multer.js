const multer = require('multer');

const upload = multer({
    limit: 1000000,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error("Please upload jpg, jpeg, webp or png format"));
        }

        cb(undefined, true);
    }
});

module.exports = upload;