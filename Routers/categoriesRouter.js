const express = require('express');
const Router = new express.Router();
const {getCategories, addCategory, updateCategory, deleteCategory, getCategoryById} = require("../Controllers/categoriesController");
const upload = require('../utils/multer');
const auth = require('../Middlewares/auth');
const isAdmin = require('../Middlewares/isAdmin');

Router.post("/categories", auth, isAdmin, upload.single('image'), addCategory);
Router.get("/categories", getCategories);
Router.get("/categories/:id", getCategoryById);
Router.patch("/categories/:id", auth, isAdmin, upload.single('image'), updateCategory);
Router.delete("/categories/:id", auth, isAdmin, deleteCategory);

module.exports = Router;