var express = require("express");
var router = express.Router();
const path = require("path");

const passport = require("passport");
const UserCollection = require("../models/userModel");
const LocalStategy = require("passport-local");
const { isLoggedIn } = require("../middleware/auth");
const {
  registerUser,
  userProfile,
  logoutUser,
  mailSend,
  verifyOtp,
  userSetting,
  userAvatar,
  deleteUser,
  updateUser,
  resetPasswordPage,
  resetPassword,
} = require("../controllers/usersController");

passport.use(new LocalStategy(UserCollection.authenticate()));

/* GET users listing. */
router.post("/register", registerUser);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/profile", isLoggedIn, userProfile);
router.get("/logout", isLoggedIn, logoutUser);

router.get("/chat", isLoggedIn, async (req, res, next) => {
  const users = await UserCollection.find({ _id: { $ne: req.user._id } });
  res.render("chat", {
    title: "Chat Page || Social Media",
    user: req.user,
    users,
  });
});

module.exports = router;
