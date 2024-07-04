const express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const { createPostPage, createPost, likePost } = require("../controllers/postController");
const router = express.Router();

router.get("/create", isLoggedIn, createPostPage);
router.post("/create", isLoggedIn,createPost );
router.get("/like/:pid",isLoggedIn,likePost);

module.exports = router;
