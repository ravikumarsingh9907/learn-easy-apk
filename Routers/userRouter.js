const express = require("express");
const course = require("../models/courses");
require("../db/database");
const customer = require("../models/users");
const bcrypt = require("bcrypt");

const Router = new express.Router();

const categories = [
  "WD(Web Development)",
  "DSA",
  "ML(Machine Learning)",
  "BC(Blockchain)",
  "DS(Data Science)",
  "AD(Anroid Development)",
  "AI(Artificial Intelligence)",
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

Router.get("/bookmarks", loginRequired, (req, res) => {
  res.status(200).render("templates/user/customer");
});

Router.post("/logout", async (req, res) => {
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

Router.get("/course/:id", async (req, res) => {
  const { id } = req.params;
  const getCourse = await course.findById(id);
  res.render("templates/user/getcourse", { getCourse });
});

module.exports = Router;
