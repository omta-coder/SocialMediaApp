const PostCollaction = require("../models/postModel");
const imagekit = require("../utils/imagekit");

exports.createPostPage = async (req, res, next) => {
  res.render("createPost", {
    title: "Creat Post || Social Media",
    user: req.user,
  });
};
exports.createPost = async (req, res, next) => {
  try {
    const newPost = await new PostCollaction(req.body);
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.media.data,
      fileName: req.files.media.name,
    });
    newPost.media = { fileId, url, thumbnailUrl };
    newPost.user = req.user._id;
    req.user.posts.push(newPost._id);

    await newPost.save();
    await req.user.save();

    res.redirect("/user/profile");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
exports.likePost = async(req,res,next)=>{
    try {
        const post = await PostCollaction.findById(req.params.pid);
        if (post.likes.includes(req.user._id)) {
            const uidx = post.likes.indexOf(req.user._id);
            post.likes.splice(uidx, 1);
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();
        res.redirect("/user/profile");
    } catch (error) {
        console.log(error);
        res.send(error.message)
    }
}
