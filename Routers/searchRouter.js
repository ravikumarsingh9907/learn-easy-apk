const express = require("express");
const router = express.Router();
const { getSearchData } = require("../Controllers/searchController");

router.get("/courses/search", getSearchData);

module.exports = router;