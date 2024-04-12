const Categories = require("../models/categories");
const course = require("../models/courses");
const customer = require("../models/users");
const review = require("../models/reviews");
const express = require("express");
const Router = new express.Router();
const upload = require('../utils/multer');
const {
    getCoursesByCategory,
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
} = require('../Controllers/coursesController');

Router.post("/courses", upload.single('image'), addCourse);
Router.get("/courses", getCourses);
Router.patch("/courses/:id", upload.single('image'), updateCourse);
Router.get("/courses/:id", getCourseById);
Router.get("/categories/:id/courses", getCoursesByCategory);

module.exports = Router;