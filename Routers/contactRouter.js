const express = require("express");
const contactus = require("../models/contactus");
const user = require("../models/users");
require("../db/database");

const Router = new express.Router();

Router.get("/contactus", (req, res) => {
  res.status(200).render("templates/contactus/contactus");
});

Router.post("/contactus", async (req, res) => {
  try {
    const loggedInUser = req.session.customer_id;
    const data = req.body;
    if (!loggedInUser) {
      const foundQuery = new contactus(data);
      await foundQuery.save();
    } else {
      const foundUser = await user.findById(loggedInUser);
      console.log(foundUser.name);
      const foundQuery = new contactus({
        name: foundUser.name,
        email: foundUser.email,
        query: data.query,
      });
      console.log(foundQuery);
      foundUser.queries.push(foundQuery);
      await foundUser.save();
      await foundQuery.save();
    }
    res.status(202).redirect("/contactus");
  } catch {
    res.status(401).send("Not able to Connect with us, try in Sometimes...");
  }
});

module.exports = Router;
