const express = require("express");
const course = require("../models/courses");
require("../db/database");

const Router = new express.Router();

Router.get("/", async (req, res) => {
  res.render("templates/user/index");
});

Router.get("/courses", async (req, res) => {
  try {
    const allCourses = await course.find({});
    res.status(200).render("templates/user/allcourses", { allCourses });
  } catch {
    res.status(400).send("Something went Wrong");
  }
});

// Category wise page
Router.get("/courses/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const showCourses = await course.find({ category });
    res.status(200).render("templates/user/catCourse", { showCourses });
  } catch {
    console.log("Something went wrong");
  }
});

Router.get("/course/:id", async (req, res) => {
  const { id } = req.params;
  const getCourse = await course.findById(id);
  res.render("templates/user/getcourse", { getCourse });
});

module.exports = Router;
