const express = require("express");
const Router = new express.Router();
const isAdmin = require("../Middlewares/isAdmin");
const {
  getUserBookmark,
  addToBookmark,
  removeFromBookmark,
  getUser,
} = require('../Controllers/userController');
const auth = require('../Middlewares/auth');

Router.get("/users/me", auth, getUser);
Router.get("/users/me/is-admin", isAdmin, getUser)
Router.get("/users/:id/bookmarks", auth, getUserBookmark);
Router.post("/courses/:id/bookmarks", auth, addToBookmark);
Router.delete("/users/:id/bookmarks", auth, removeFromBookmark);

module.exports = Router;
