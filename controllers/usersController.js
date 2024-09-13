const UserCollection = require("../models/userModel");

const passport = require("passport");
const LocalStategy = require("passport-local");

passport.use(new LocalStategy(UserCollection.authenticate()));

exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const unChangableData = { username, email };
    const encryptedData = password;
    await UserCollection.register(unChangableData, encryptedData);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.userProfile = async function (req, res, next) {
  try {
    res.render("profile", {
      title: "Login Page / Social Media",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.logoutUser = function (req, res, next) {
  req.logout(() => {
    res.redirect("/login");
  });
};
