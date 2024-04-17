const express = require('express');
const Router = new express.Router();
const {getPlatforms, addPlatform, updatePlatform, deletePlatform} = require("../Controllers/platformsController");
const upload = require('../utils/multer');
const auth = require('../Middlewares/auth');
const isAdmin = require('../Middlewares/isAdmin');

Router.post("/platforms", auth, isAdmin, upload.single('image'), addPlatform);
Router.get("/platforms", getPlatforms);
Router.patch("/platforms/:id", auth, isAdmin, upload.single('image'), updatePlatform);
Router.delete("/platforms/:id", auth, isAdmin, deletePlatform);

module.exports = Router;