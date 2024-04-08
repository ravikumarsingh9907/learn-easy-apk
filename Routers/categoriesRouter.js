const express = require('express');
const Router = new express.Router();
const {getCategories, addCategory, updateCategory, deleteCategory} = require("../Controllers/categoriesController");
const multer = require('multer');

const upload = multer({
    destination: 'images/',
    limit: 1000000,
    fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        return cb(new Error("Please upload jpg, jpeg, webp or png format"));
    }

    cb(undefined, true);
    }
});

Router.post("/categories", upload.single('image'), addCategory);
Router.get("/categories", getCategories);
Router.patch("/categories/:id", upload.single('image'), updateCategory);
Router.delete("/categories/:id", deleteCategory);

module.exports = Router;