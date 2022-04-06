if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
require("./db/database");
const course = require("./models/courses");
const path = require("path");
const methodOverride = require("method-override");
const adminRouter = require("./Routers/adminRouter");
const userRouter = require("./Routers/userRouter");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Admin Router
app.use(adminRouter);
app.use(userRouter);

// Listening to port
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
