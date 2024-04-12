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
    deleteCourse,
} = require('../Controllers/coursesController');
const auth = require('../Middlewares/auth');
const isAdmin = require('../Middlewares/isAdmin');

Router.post("/courses", auth, isAdmin, upload.single('image'), addCourse);
Router.get("/courses", getCourses);
Router.patch("/courses/:id", auth, isAdmin, upload.single('image'), updateCourse);
Router.delete("/courses/:id", auth, isAdmin, deleteCourse);
Router.get("/courses/:id", getCourseById);
Router.get("/categories/:id/courses", getCoursesByCategory);

module.exports = Router;