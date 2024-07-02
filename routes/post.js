const express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const router = express.Router()

router.get("/create",isLoggedIn,async(req,res,next)=>{
res.render("createPost",{title:"Creat Post || Social Media",user:req.user})
})

module.exports = router;