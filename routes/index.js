var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page/ Social Media' ,user:req.user});
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

module.exports = router;
