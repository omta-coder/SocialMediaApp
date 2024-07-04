const PostCollaction = require("../models/postModel");
const UserCollection = require("../models/userModel");
const imagekit = require("../utils/imagekit");

const passport = require("passport");
const LocalStategy = require("passport-local");
const { sendMail } = require("../utils/sendmail");

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
    const posts = await PostCollaction.find().populate("user");
    res.render("profile", {
      title: "Login Page / Social Media",
      user: req.user,
      posts: posts,
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
exports.mailSend = async (req, res, next) => {
  try {
    const user = await UserCollection.findOne({ email: req.body.email });
    if (!user) {
      return res.send(
        "No user found with this email. <a href='/forget'>Try again</a>"
      );
    }
    await sendMail(req, res, user);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.verifyOtp = async (req, res, next) => {
  try {
    const user = await UserCollection.findById(req.params.id);
    if (!user) {
      return res.send("No user found !");
    }
    if (user.otp != req.body.otp) {
      user.otp = 0;
      await user.save();
      return res.send("Invalid OTP ! <a href='/forget'>Try again</a>");
    }
    user.otp = 0;
    await user.setPassword(req.body.password);
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.userSetting = async (req, res, next) => {
  try {
    const userAndPosts = await req.user.populate("posts");
    res.render("setting", {
      title: "Setting Page || SocialMedia",
      user: req.user,
      user: userAndPosts,
    });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.userAvatar = async (req, res, next) => {
  try {
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.avatar.data,
      fileName: req.files.avatar.name,
    });
    if (req.user.avatar.fileId) {
      await imagekit.deleteFile(req.user.avatar.fileId);
    }
    req.user.avatar = { fileId, url, thumbnailUrl };
    await req.user.save();

    res.redirect("/user/setting");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await UserCollection.findByIdAndDelete(req.params.id);
    await imagekit.deleteFile(user.avatar.fileId);
    await user.posts.forEach(async (post) => {
      const deletedPost = await PostCollaction.findByIdAndDelete(post);
      await imagekit.deleteFile(deletedPost.media.fileId);
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    await UserCollection.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/user/profile");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.resetPasswordPage = (req, res, next) => {
  res.render("resetpassword", {
    title: "Reset Password Page / Social Media",
    user: req.user,
  });
};
exports.resetPassword = async (req, res, next) => {
  try {
    await req.user.changePassword(req.body.oldpassword, req.body.newpassword);
    await req.user.save();
    res.redirect("/user/setting");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
