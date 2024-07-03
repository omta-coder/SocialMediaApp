var express = require('express');
const PostCollaction = require('../models/postModel');
var router = express.Router();

/* GET home page. */
router.get('/',async function(req, res, next) {
  try {
    const posts = await PostCollaction.find().populate("user")
    res.render('index', { title: 'Home Page/ Social Media' ,user:req.user,posts:posts});
  } catch (error) {
    console.log(error);
    res.send(error.message)
  }
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Page / Social Medial',user:req.user });
});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Page / Social Media' ,user:req.user});
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login Page / Social Media',user:req.user});
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register Page / Social Media',user:req.user });
});
router.get('/forget', function(req, res, next) {
  res.render('forget', { title: 'Forgot Page / Social Media' 
    ,user:req.user
  });
});
router.get('/verify-otp/:id', function(req, res, next) {
  res.render('forgetOtp', { title: 'Verify OTP / Social Media' 
    ,user:req.user,
    id:req.params.id
  });
});


module.exports = router;
