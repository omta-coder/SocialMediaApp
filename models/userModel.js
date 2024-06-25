const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")

const UserSchema= new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_yrd8qyMAeTKfxPH00Az2BqE561qnoB5Ulw&s"
    },
    otp:{
        type:Number,
        default:0
    }
},{timestamps:true})

UserSchema.plugin(plm);

const UserCollection = mongoose.model("User",UserSchema);
module.exports = UserCollection;  //exporting the model so that it can be used in other