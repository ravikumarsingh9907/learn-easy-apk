const express = require("express");
const course = require("../models/courses");
require("../db/database");
const customer = require("../models/users");
const review = require("../models/reviews");
const Categories = require("../models/categories");
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

Router.post("/course/:id/bookmark", async (req, res, next) => {
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
