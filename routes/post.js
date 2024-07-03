const express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const PostCollaction = require("../models/postModel");
const imagekit = require("../utils/imagekit");
const router = express.Router()

router.get("/create",isLoggedIn,async(req,res,next)=>{
res.render("createPost",{title:"Creat Post || Social Media",user:req.user})
})
router.post("/create",isLoggedIn,async(req,res,next)=>{
try {
    const newPost = await new PostCollaction(req.body);
    const {fileId,url,thumbnailUrl} = await imagekit.upload({
        file: req.files.media.data,
        fileName: req.files.media.name,
      });
      newPost.media = {fileId,url,thumbnailUrl};
      newPost.user = req.user._id;
      req.user.posts.push(newPost._id);

      await newPost.save();
      await req.user.save();

      res.redirect("/user/profile");
      
} catch (error) {
    console.log(error);
    res.send(error.message);
}
})

module.exports = router;