const express = require("express");
const course = require("../models/courses");
require("../db/database");
const customer = require("../models/users");
const review = require("../models/reviews");
const Categories = require("../models/categories");
const bcrypt = require("bcrypt");
const CustomError = require("../errorHandler");

const Router = new express.Router();

const loginRequired = (req, res, next) => {
  if (!req.session.customer_id) {
    res.status(401).render("templates/errors/authentication");
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

Router.get("/", async (req, res) => {
  const getCategory = await Categories.find({});
  const getCategories = [];
  for (var i = 0; i < 6; i++) {
    getCategories.push(getCategory[i]);
  }
  res.status(200).render("templates/user/index", { getCategories });
});

// Admin Login Authentication
Router.get("/login", (req, res) => {
  if (!req.session.customer_id) {
    return res.status(200).render("templates/user/login");
  }
  res.status(500).send({ error: "Already logged in" });
});

Router.post("/login", async (req, res) => {
  const data = req.body;
  const Customer = await customer.findOne({ email: data.email });
  if (!Customer) {
    return res.status(404).send({ error: "Invalid email or password" });
  }
  const validateCustomer = await bcrypt.compare(
    data.password,
    Customer.password
  );
  if (!validateCustomer) {
    return res.status(404).send({ error: "Invalid email or password" });
  }
  req.session.customer_id = Customer._id;
  res.status(200).redirect("/");
});

Router.get("/signup", (req, res) => {
  if (!req.session.customer_id) {
    return res.status(200).render("templates/user/signup");
  }
  res.status(500).send({ error: "Already created Account" });
});

Router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 12);
    const savedData = new customer({
      name,
      email,
      password: hashedPass,
    });
    await savedData.save();
    req.session.customer_id = savedData._id;
    res.status(200).redirect("/");
  } catch {
    res.status(400).send("User not created");
  }
});

Router.get("/bookmark", loginRequired, async (req, res) => {
  const id = req.session.customer_id;
  const foundUser = await customer.findById(id).populate("Bookmark");
  console.log(foundUser);
  res.status(200).render("templates/user/customer", { foundUser });
});

Router.get("/search", async (req, res) => {
  try {
    let searchCourse = req.query.coursename;
    searchCourse = searchCourse.toLowerCase();
    const showCourses = await course.find({
      $or: [
        { title: { $regex: req.query.coursename } },
        { category: { $regex: req.query.coursename } },
        { tags: { $regex: searchCourse } },
      ],
    });
    res.status(200).render("templates/user/catCourse", { showCourses });
  } catch {
    res.status(400).send("Something went wrong at search");
  }
});

Router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.status(200).redirect("/");
});

Router.get("/categories", async (req, res) => {
  try {
    const getCategories = await Categories.find({});
    res.status(200).render("templates/user/categories", { getCategories });
  } catch {
    res.status(400).send("Couldn't get categories");
  }
});

// Category wise page
Router.get("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const showCourses = await Categories.findById(id).populate("courses");
    res.status(200).render("templates/user/catCourse", { showCourses });
  } catch {
    console.log("Something went wrong");
  }
});

Router.get("/courses", async (req, res) => {
  try {
    const allCourses = await course.find({});
    res.status(200).render("templates/user/allcourses", { allCourses });
  } catch {
    res.status(400).send("Something went Wrong");
  }
});

Router.post("/courses/:id", loginRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.customer_id;
    let foundUser = await customer.findById(userId);
    let foundCourse = await course.findById(id);
    let addReview = new review(req.body);
    foundUser.reviews.push(addReview);
    foundCourse.reviews.push(addReview);
    addReview.user = foundUser;
    await foundCourse.save();
    await foundUser.save();
    await addReview.save();
    res.status(200).redirect(`/courses/${id}`);
  } catch {
    res.status(400).send("Something went wrong at adding review");
  }
});

Router.get("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getCourse = await course.findById(id).populate("reviews");

    const totalRating = [];
    for (var i = 0; i < getCourse.reviews.length; i++) {
      totalRating.push(getCourse.reviews[i].rating);
    }

    const ratingCount = totalRating.length;
    const avgRating = averageRating(totalRating);

    res
      .status(200)
      .render("templates/user/course", { getCourse, avgRating, ratingCount });
  } catch {
    res
      .status(400)
      .send({ error: "Something went wrong at getting categories courses" });
  }
});

Router.post("/courses/:id/bookmark", loginRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const foundCourse = await course.findById(id);
    const foundUser = await customer.findById(req.session.customer_id);
    foundUser.Bookmark.push(foundCourse);
    foundUser.save();
    res.status(200).redirect(`/course/${id}`);
  } catch {
    res.status(400).send("Something went wrong");
  }
});

module.exports = Router;
