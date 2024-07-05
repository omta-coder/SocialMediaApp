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
router.post("/send-mail", mailSend);
router.post("/verify-otp/:id", verifyOtp);
router.get("/setting", isLoggedIn, userSetting);
router.post("/avatar/:id", isLoggedIn, userAvatar);
router.get("/delete/:id", isLoggedIn, deleteUser);
router.post("/update/:id", isLoggedIn, updateUser);
router.get("/reset-password/:id", isLoggedIn, resetPasswordPage);
router.post("/reset-password/:id", isLoggedIn, resetPassword);
router.get("/chat",isLoggedIn,(req,res,next)=>{
 res.render("chat",{title:"Chat Page || Social Media",
  user:req.user,
 })
})

module.exports = router;
