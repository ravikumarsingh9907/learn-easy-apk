const jwt = require('jsonwebtoken');
const crypto = require("crypto");
function generateAuthToken(user) {
    return jwt.sign({_id: user._id, isAdmin: user.isAdmin}, process.env.WEB_TOKEN, {
        expiresIn: 7 * 24 * 60 * 60
    });
}

const generateVerificationToken = () => {
    return crypto.randomBytes(16).toString('hex');
}

const generateAccessToken = function () {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
}

module.exports = Object.freeze({
    generateAuthToken,
    generateVerificationToken,
    generateAccessToken,
});