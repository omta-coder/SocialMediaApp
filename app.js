require("dotenv").config({path:"./.env"})
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");

//file uploader
const fileUpload = require("express-fileupload")

mongoose.connect(process.env.MONGODB_URL).then(()=>{
  console.log("connected to database")
}).catch((err)=>{
  console.log(err);
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');

var app = express();

const session = require("express-session")
const passport = require("passport")
const UserCollection = require("./models/userModel")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(UserCollection.serializeUser());
passport.deserializeUser(UserCollection.deserializeUser());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/post', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
