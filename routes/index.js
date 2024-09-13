var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("index", {
    title: "Home Page/ Social Media",
    user: req.user,
  });
});
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login Page / Social Media", user: req.user });
});
router.get("/register", function (req, res, next) {
  res.render("register", {
    title: "Register Page / Social Media",
    user: req.user,
  });
});

module.exports = router;
