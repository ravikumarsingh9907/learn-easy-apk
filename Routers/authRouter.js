
const express = require("express");
const {
    loginUser,
    signUpUser,
    signOutUser,
    verifyUser,
    forgotPassword,
    verifyOtpForForgotPassword,
    resetPassword,
    verifyOtpForForgotPasswordUrl,
} = require('../Controllers/authController');
const auth = require('../Middlewares/auth');

const Router = new express.Router();

Router.post("/login", loginUser);
Router.post("/signup", signUpUser);
Router.post("/logout", auth, signOutUser);
Router.get('/signup/verify-user/:token', verifyUser);
Router.post("/forgot-password", forgotPassword);
Router.post("/forgot-password/verify-user/:token", verifyOtpForForgotPasswordUrl, verifyOtpForForgotPassword);
Router.post("/forgot-password/verify-user/:token/new-password", verifyOtpForForgotPasswordUrl, resetPassword);

module.exports = Router;