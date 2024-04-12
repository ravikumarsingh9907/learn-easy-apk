const express = require('express');
const Router = new express.Router();
const {getCategories, addCategory, updateCategory, deleteCategory} = require("../Controllers/categoriesController");
const upload = require('../utils/multer');

Router.post("/categories", upload.single('image'), addCategory);
Router.get("/categories", getCategories);
Router.patch("/categories/:id", upload.single('image'), updateCategory);
Router.delete("/categories/:id", deleteCategory);

module.exports = Router;