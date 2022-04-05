if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
require("./db/database");
const course = require("./models/courses");
const path = require("path");
const methodOverride = require("method-override");
const adminRouter = require("./Routers/adminRouter");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Admin Router
app.use(adminRouter);

app.get("/", async (req, res) => {
  res.render("templates/user/index");
});

// Category wise page
app.get("/courses/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const showCourses = await course.find({ category });
    res.status(200).render("templates/user/catCourse", { showCourses });
  } catch {
    console.log("Something went wrong");
  }
});

app.get("/course/:id", async (req, res) => {
  const id = req.params;
  const getCourse = await course.findById(id);
  res.render("getcourse", { getCourse });
});

// Listening to port
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
