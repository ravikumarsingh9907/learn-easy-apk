if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const course = require("../models/courses");
require("../db/database");
const user = require("../models/admin");
const Category = require("../models/categories");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const Router = new express.Router();

// Levels
const levels = ["Begginer", "Intermediate", "Advanced"];

// Price
const price = ["Free", "Paid", "Free/Paid"];

// Types
const types = ["Article", "Video", "Article/Video"];

const loginRequired = (req, res, next) => {
  if (!req.session.user_id) {
    return res.status(401).send({ error: "please Authenticate" });
  }
  next();
};

const averageRating = (ratings) => {
  let sum = 0;
  let avg = 0;
  for (var i = 0; i < ratings.length; i++) {
    sum += ratings[i];
  }
  avg = sum / ratings.length;
  return avg;
};

Router.get("/admin", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).redirect("/admin/login");
  }
  res.status(200).redirect("/admin/courses");
});

// Admin Login Authentication
Router.get("/admin/login", (req, res) => {
  if (!req.session.user_id) {
    return res.status(200).render("templates/admin/login");
  }
  res.status(400).send({ error: "Already logged in" });
});

Router.post("/admin/login", async (req, res) => {
  const data = req.body;
  const User = await user.findOne({ email: data.email });
  if (!User) {
    return res.status(203).send({ error: "Invalid email or password" });
  }
  const validateUser = await bcrypt.compare(data.password, User.password);
  if (!validateUser) {
    return res.status(203).send({ error: "Invalid email or password" });
  }
  req.session.user_id = User._id;
  res.status(200).redirect("/admin/courses");
});

Router.get("/admin/signup", (req, res) => {
  if (!req.session.user_id) {
    return res.status(200).render("templates/admin/signup");
  }
  res.status(400).send({ error: "Already logged In" });
});

Router.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 12);
    const savedData = new user({
      name,
      email,
      password: hashedPass,
    });
    await savedData.save();
    req.session.user_id = savedData._id;
    res.status(201).redirect("/admin/courses");
  } catch {
    res.status(406).send("User not created");
  }
});

Router.post("/admin/logout", async (req, res) => {
  req.session.destroy();
  res.status(200).redirect("/admin/login");
});

// Getting all courses and adding new course Endpoints
Router.get("/admin/courses", loginRequired, async (req, res) => {
  try {
    const allCourses = await course.find({});
    res.status(200).render("templates/admin/index", { allCourses });
  } catch (e) {
    res.status(403).send("Can't Get Courses");
  }
});

Router.get("/admin/courses/add", loginRequired, async (req, res) => {
  try {
    const getCategories = await Category.find({});
    res
      .status(200)
      .render("templates/admin/chooseCategories", { getCategories });
  } catch {
    res.status(400).send("Can't Add Course, Try In Sometimes...");
  }
});

Router.post("/admin/courses/add", upload.single("image"), async (req, res) => {
  try {
    const addCategory = new Category(req.body);
    addCategory.image = req.file.path;
    await addCategory.save();
    res.status(201).redirect(`/admin/courses/add/${addCategory._id}`);
  } catch {
    res.status(406).send("Something went wrong at add Category");
  }
});

Router.get("/admin/courses/add/:id", loginRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const getCategory = await Category.findById(id);
    res.status(200).render("templates/admin/addCourse", {
      getCategory,
      price,
      levels,
      types,
    });
  } catch {
    res.status(400).send("Something went wrong at Getting Category");
  }
});

Router.post(
  "/admin/courses/add/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const getCategory = await Category.findById(id);
      const addCourse = new course(req.body);
      addCourse.image = req.file.path;
      getCategory.courses.push(addCourse);
      await addCourse.save();
      await getCategory.save();
      req.flash("success", `Successfully added new course`);
      res.status(201).redirect("/admin/courses");
    } catch (err) {
      res.status(406).send("Something went wrong", err);
    }
  }
);

// Getting Updating and deleting courses by it's id
Router.get("/admin/courses/:id", loginRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const getCourse = await course.findById(id).populate("reviews");

    const totalRating = [];
    const totalReview = [];
    for (var i = 0; i < getCourse.reviews.length; i++) {
      totalRating.push(getCourse.reviews[i].rating);
      totalReview.push(getCourse.reviews[i].review);
    }

    const ratingCount = totalRating.length;
    const reviewCount = totalReview.length;

    // calculating average
    const avgRating = averageRating(totalRating).toFixed(2);

    res.status(200).render("templates/admin/course", {
      getCourse,
      ratingCount,
      reviewCount,
      avgRating,
    });
  } catch {
    res.status(400).render("Cannot get Course Details");
  }
});

Router.put(
  "/admin/courses/:id/edit",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const getCourse = await course.findByIdAndUpdate(id, req.body);
      getCourse.image = req.file.path;
      await getCourse.save();
      req.flash("success", `Successfully updated your course`);
      res.status(202).redirect("/admin/courses");
    } catch {
      res.status(400).render("Cannot Update Course, Try in Sometimes...");
    }
  }
);

Router.get("/admin/courses/:id/edit", loginRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const getCourse = await course.findById(id);
    res.status(200).render("templates/admin/editCourse", {
      getCourse,
      levels,
      price,
      types,
    });
  } catch {
    res.status(400).render("Not able to get Update course page.");
  }
});

Router.delete("/admin/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedId = await course.findByIdAndDelete(id);
    req.flash("success", `Successfully Deleted course`);
    res.status(200).redirect("/admin/courses");
  } catch {
    res
      .status(400)
      .send("Not able to delete Course at this moment, Try after Sometimess");
  }
});

module.exports = Router;
