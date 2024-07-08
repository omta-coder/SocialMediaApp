const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")

const UserSchema= new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    avatar:{
        fileId: String,
        url: String,
        thumbnailUrl: String,
    },
    otp:{
        type:Number,
        default:0
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
    socketId: String,
},{timestamps:true})

UserSchema.plugin(plm);

const UserCollection = mongoose.model("user",UserSchema);
module.exports = UserCollection;  //exporting the model so that it can be used in other