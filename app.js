if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
require("./db/database");
const path = require("path");
const methodOverride = require("method-override");
const adminRouter = require("./Routers/adminRouter");
const userRouter = require("./Routers/userRouter");
const contactRouter = require("./Routers/contactRouter");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const secretKey = {
  secret: "mynameisravikumarsingh",
  resave: false,
  saveUninitialized: true,
};
app.use(session(secretKey));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentLoggedIn = req.session.customer_id;
  res.locals.success = req.flash("success");
  next();
});

// Admin Router
app.use(adminRouter);
app.use(userRouter);
app.use(contactRouter);

// Listening to port
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
