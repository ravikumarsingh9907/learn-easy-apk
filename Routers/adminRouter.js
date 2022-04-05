if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const course = require("../models/courses");
require("../db/database");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const Router = new express.Router();

// creating Categories
const categories = [
  "WD(Web Development)",
  "DSA",
  "ML(Machine Learning)",
  "BC(Blockchain)",
  "DS(Data Science)",
  "AD(Anroid Development)",
  "AI(Artificial Intelligence)",
];

// Levels
const levels = ["Begginer", "Intermediate", "Advanced"];

// Price
const price = ["FREE", "PAID", "FREE/PAID"];

// Getting all courses and adding new course Endpoints
Router.get("/admin/courses", async (req, res) => {
  try {
    const courses = await course.find({});
    res.status(200).render("templates/admin/index", { courses });
  } catch (e) {
    res.status(400).send("Something went wrong");
  }
});

Router.get("/admin/courses/add", (req, res) => {
  try {
    res.render("templates/admin/addCourse", { categories, levels, price });
  } catch {
    res.status(400).send("Something went wrong");
  }
});

Router.post("/admin/courses/add", upload.single("image"), async (req, res) => {
  try {
    const addCourse = new course(req.body);
    addCourse.image = req.file.path;

    await addCourse.save();
    res.redirect("/admin/courses");
  } catch (err) {
    res.status(400).send("Something went wrong", err);
  }
});

// Getting Updating and deleting courses by it's id
Router.get("/admin/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getCourse = await course.findById(id);
    res.status(200).render("templates/admin/course", { getCourse });
  } catch {
    res.status(400).render("Something went wrong");
  }
});

Router.put("/admin/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getCourse = await course.findByIdAndUpdate(id, req.body);
    res.status(200).render("templates/admin/course", { getCourse });
  } catch {
    res.status(400).render("Something went wrong");
  }
});

Router.get("/admin/courses/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const getCourse = await course.findById(id);
    res.status(200).render("templates/admin/editCourse", {
      getCourse,
      categories,
      levels,
      price,
    });
  } catch {
    res.status(400).render("Something went wrong");
  }
});

Router.delete("/admin/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedId = await course.findByIdAndDelete(id);
    res.status(200).redirect("/admin/courses");
  } catch {
    res.status(500).send("Something went wrong");
  }
});

module.exports = Router;
