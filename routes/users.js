var express = require('express');
var router = express.Router();

const passport = require("passport");
const UserCollection = require('../models/userModel');
const LocalStategy = require("passport-local");
const { isLoggedIn } = require('../middleware/auth');
const { sendMail } = require('../utils/sendmail');

passport.use(new LocalStategy(UserCollection.authenticate()));

/* GET users listing. */
router.post('/register', async(req, res, next)=> {
  try {
    const {username,email,password} = req.body;
    const unChangableData = {username,email};
    const encryptedData = password;
    await UserCollection.register(unChangableData,encryptedData)
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});
router.post('/login',passport.authenticate("local",{
  successRedirect:"/user/profile",
  failureRedirect:"/login"
}),
(req,res)=>{}
)

router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile', { title: 'Login Page / Social Media',user:req.user});
});
router.get('/logout',isLoggedIn, function(req, res, next) {
  req.logout(()=>{
    res.redirect('/login');
});
});

router.post("/send-mail",async(req,res,next)=>{
  try {
    const user = await UserCollection.findOne({email:req.body.email});
    if(!user){
      return res.send("No user found with this email. <a href='/forget'>Try again</a>");
    }
    await sendMail(req,res,user);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
})
router.post("/verify-otp/:id",async(req,res,next)=>{
  try {
    const user = await UserCollection.findById(req.params.id);
    if(!user){
      return res.send("No user found !");
    }
    if(user.otp != req.body.otp){
      user.otp = 0
      await user.save();
      return res.send("Invalid OTP ! <a href='/forget'>Try again</a>");
    }
    user.otp = 0
    await user.setPassword(req.body.password)
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message)
  }
})

module.exports = router;
