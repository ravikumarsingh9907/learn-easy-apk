const express = require("express");
const course = require("../models/courses");
require("../db/database");
const customer = require("../models/users");
const review = require("../models/reviews");
const Categories = require("../models/categories");
const Router = new express.Router();
const {
  getUserBookmark,
  addToBookmark,
  removeFromBookmark,
  getUser,
} = require('../Controllers/userController');
const auth = require('../Middlewares/auth');

Router.get("/users/me", auth, getUser);
Router.get("/users/:id/bookmarks", auth, getUserBookmark);
Router.post("/courses/:id/bookmarks", auth, addToBookmark);
Router.delete("/users/:id/bookmarks", auth, removeFromBookmark);

module.exports = Router;
