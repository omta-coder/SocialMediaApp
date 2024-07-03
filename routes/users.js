var express = require('express');
var router = express.Router();
const path = require("path");

const passport = require("passport");
const UserCollection = require('../models/userModel');
const LocalStategy = require("passport-local");
const { isLoggedIn } = require('../middleware/auth');
const { sendMail } = require('../utils/sendmail');
const imagekit = require('../utils/imagekit');
const PostCollaction = require('../models/postModel');


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

router.get('/profile',isLoggedIn, async function(req, res, next) {
try {
  const posts = await PostCollaction.find().populate("user");
    res.render('profile', { title: 'Login Page / Social Media',user:req.user,posts:posts});
} catch (error) {
  console.log(error);
    res.send(error.message);
}
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
});
router.get("/setting",isLoggedIn,async(req,res,next)=>{
  try {
    const userAndPosts = await req.user.populate("posts")
    res.render("setting",{title: "Setting Page || SocialMedia",user:req.user,user:userAndPosts})
  } catch (error) {
    console.log(error);
    res.send(error.message)
  }
})
router.post("/avatar/:id",isLoggedIn,async(req,res,next)=>{
  try {
    const {fileId,url,thumbnailUrl} = await imagekit.upload({
      file: req.files.avatar.data,
      fileName: req.files.avatar.name,
    })
    if(req.user.avatar.fileId){
      await imagekit.deleteFile(req.user.avatar.fileId)
    }
    req.user.avatar = {fileId,url,thumbnailUrl}
    await req.user.save();

    res.redirect("/user/setting");
  } catch (error) {
    console.log(error);
    res.send(error.message)
  }
})
router.get("/delete/:id",isLoggedIn,async(req,res,next)=>{
  try {
    const user = await UserCollection.findByIdAndDelete(req.params.id);
    await imagekit.deleteFile(user.avatar.fileId);
    await user.posts.forEach(async(post)=>{
      const deletedPost = await PostCollaction.findByIdAndDelete(post)
      await imagekit.deleteFile(deletedPost.media.fileId)
    })
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message)
  }
})
router.post("/update/:id", isLoggedIn, async (req, res, next) => {
  try {
      await UserCollection.findByIdAndUpdate(req.params.id, req.body);
      res.redirect("/user/profile");
  } catch (error) {
      console.log(error);
      res.send(error.message);
  }
});
router.get('/reset-password/:id',isLoggedIn, (req, res, next)=>{
  res.render('resetpassword', { title: 'Reset Password Page / Social Media' 
    ,user:req.user
  });
});
router.post('/reset-password/:id',isLoggedIn, async(req, res, next)=> {
  try {
    await req.user.changePassword(req.body.oldpassword, req.body.newpassword);
    await req.user.save();
    res.redirect('/user/setting');
  } catch (error) {
    console.log(error);
    res.send(error.message)
  }
});

module.exports = router;

