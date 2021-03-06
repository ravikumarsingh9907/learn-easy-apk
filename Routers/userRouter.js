const express = require("express");
const course = require("../models/courses");
require("../db/database");
const customer = require("../models/users");
const review = require("../models/reviews");
const Categories = require("../models/categories");
const bcrypt = require("bcrypt");

const Router = new express.Router();

const loginRequired = (req, res, next) => {
  if (!req.session.customer_id) {
    return res.status(401).redirect("/login");
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
  try {
    const getCategory = await Categories.find({});
    const getCategories = [];
    for (var i = 0; i < 6; i++) {
      getCategories.push(getCategory[i]);
    }
    res.status(200).render("templates/user/index", { getCategories });
  } catch {
    res
      .status(400)
      .send({ error: "Can't Reach to Home Page, try in Sometimes" });
  }
});

// Admin Login Authentication
Router.get("/login", (req, res) => {
  if (!req.session.customer_id) {
    return res.status(200).render("templates/user/login");
  }
  res.status(400).send({ error: "Already logged in" });
});

Router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const Customer = await customer.findOne({ email: data.email });
    if (!Customer) {
      return res.status(203).send({ error: "Invalid email or password" });
    }
    const validateCustomer = await bcrypt.compare(
      data.password,
      Customer.password
    );
    if (!validateCustomer) {
      return res.status(203).send({ error: "Invalid email or password" });
    }
    req.session.customer_id = Customer._id;
    res.status(200).redirect("/");
  } catch {
    res.status(400).send({
      error: "Something went wrong at Login, Try Again after Sometimes",
    });
  }
});

Router.get("/signup", (req, res) => {
  if (!req.session.customer_id) {
    return res.status(200).render("templates/user/signup");
  }
  res.status(400).send({ error: "Already created Account" });
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
    res.status(201).redirect("/");
  } catch {
    res.status(400).send("User not created");
  }
});

// Rest password
Router.get("/forgotpassword", (req, res) => {
  res.render("templates/user/forgotpass");
});

Router.post("/forgotpassword", async (req, res) => {
  try {
    const userEmail = req.body;
    const foundUser = await customer.findOne(userEmail);
    if (foundUser.length == 0) {
      res.status(404).send({ error: "Couldn't found user" });
    } else {
      res
        .status(200)
        .redirect(`/forgotpassword/${foundUser.email}/newpassword`);
    }
  } catch {
    res.send({ error: "user not found" });
  }
});

Router.post("/forgotpassword/:email/newpassword", async (req, res) => {
  try {
    const { email } = req.params;
    const foundUser = await customer.findOne({ email });
    console.log(foundUser);
    const password = req.body.password;
    const hashedPass = await bcrypt.hash(password, 12);
    foundUser.password = hashedPass;
    await foundUser.save();
    res.status(202).redirect("/login");
  } catch {
    res
      .status(400)
      .send({ error: "Something went wrong, please try after sometime" });
  }
});

Router.get("/forgotpassword/:email/newpassword", async (req, res) => {
  const userEmail = req.params.email;
  const foundUser = await customer.findOne({ email: userEmail });
  res.status(200).render("templates/user/newpass", { foundUser });
});

Router.get("/bookmark", loginRequired, async (req, res) => {
  try {
    const id = req.session.customer_id;
    const foundUser = await customer.findById(id).populate("Bookmark");
    res.status(200).render("templates/user/bookmark", { foundUser });
  } catch {
    res.status(400).send("Something went wrong at bookmark");
  }
});

Router.get("/search", async (req, res) => {
  try {
    let searchCourse = req.query.coursename;
    searchCourse = searchCourse.toLowerCase();
    const allCourses = await course.find({
      $or: [
        { title: { $regex: req.query.coursename } },
        { tags: { $regex: searchCourse } },
      ],
    });
    res.status(200).render("templates/user/allcourses", { allCourses });
  } catch {
    res.status(400).send("Something went wrong at search");
  }
});

Router.get("/profile", loginRequired, async (req, res) => {
  try {
    const foundUser = await customer
      .findById(req.session.customer_id)
      .populate("Bookmark");
    res.status(200).render("templates/user/profile", { foundUser });
  } catch {
    res.status(400).send("Couldn't able to fetch your profile");
  }
});

Router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.status(202).redirect("/");
});

Router.get("/about", async (req, res) => {
  res.status(202).render("templates/user/about");
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
    res.status(201).redirect(`/courses/${id}`);
  } catch {
    res.status(400).send("Something went wrong at adding review");
  }
});

Router.get("/courses/:id", async (req, res) => {
  try {
    if (!req.session.customer_id) {
      const { id } = req.params;
      const getCourse = await course.findById(id).populate({
        path: "reviews",
        populate: { path: "user" },
      });

      // counting total number of rating and reviews
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

      res.status(200).render("templates/user/course", {
        getCourse,
        avgRating,
        ratingCount,
        reviewCount,
      });
    } else {
      const { id } = req.params;
      const getCourse = await course.findById(id).populate({
        path: "reviews",
        populate: { path: "user" },
      });

      const foundUser = await customer
        .findById(req.session.customer_id)
        .populate("Bookmark");

      // counting total number of rating and reviews
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

      var count = 0;
      for (var duplicate of foundUser.Bookmark) {
        if (duplicate.title == getCourse.title) {
          count++;
        }
      }

      res.status(200).render("templates/user/course", {
        getCourse,
        avgRating,
        ratingCount,
        reviewCount,
        count,
      });
    }
  } catch {
    res
      .status(400)
      .send({ error: "Something went wrong at getting categories courses" });
  }
});

Router.post("/course/:id/bookmark", loginRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundCourse = await course.findById(id);
    const foundUser = await customer
      .findById(req.session.customer_id)
      .populate("Bookmark");

    foundUser.Bookmark.push(foundCourse);
    await foundUser.save();
    res.status(202).redirect(`/courses/${id}`);
  } catch {
    res.status(400).send("Something went wrong, please try again");
  }
});

Router.delete("/course/:id/bookmark", async (req, res) => {
  try {
    const { id } = req.params;
    const foundUser = await customer.findByIdAndUpdate(
      req.session.customer_id,
      {
        $pull: { Bookmark: id },
      }
    );

    foundUser.save();
    res.status(202).redirect(`/bookmark`);
  } catch {
    res.status(400).send("Something Went Wrong at Deleting");
  }
});

module.exports = Router;
