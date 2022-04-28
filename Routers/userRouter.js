const express = require("express");
const course = require("../models/courses");
require("../db/database");
const customer = require("../models/users");
const review = require("../models/reviews");
const bcrypt = require("bcrypt");

const Router = new express.Router();

const categories = [
  "Web Development",
  "DSA",
  "Machine Learning",
  "Blockchain",
  "Data Science",
  "Anroid Development",
  "Artificial Intelligence",
];

const loginRequired = (req, res, next) => {
  if (!req.session.customer_id) {
    return res.status(404).send({ error: "please Authenticate" });
  }
  next();
};

Router.get("/", async (req, res) => {
  res.render("templates/user/index");
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
    return res.status(200).render("templates/user/signup", { categories });
  }
  res.status(500).send({ error: "Already created Account" });
});

Router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, interest } = req.body;
    const hashedPass = await bcrypt.hash(password, 12);
    const savedData = new customer({
      name,
      email,
      password: hashedPass,
      interest,
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

Router.post("/course/:id", loginRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.customer_id;
    const foundUser = await customer.findById(userId);
    const foundCourse = await course.findById(id);
    const addReview = new review(req.body);
    foundUser.reviews.push(addReview);
    addReview.user = foundUser;
    foundCourse.reviews.push(addReview);
    await foundUser.save();
    await foundCourse.save();
    await addReview.save();
    res.status(200).redirect(`/course/${id}`);
  } catch {
    res.status(400).send("Something went wrong at adding review");
  }
});

Router.get("/course/:id", async (req, res) => {
  const { id } = req.params;
  const populatedReview = await review.find();
  const getCourse = await course.findById(id).populate("reviews");
  res.status(200).render("templates/user/course", { getCourse });
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
