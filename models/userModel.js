const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    avatar: {
      url: {
        type: String,
        default:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSteItzPyeDKBxyWiOA8xrPZXIlxOYv1b1VVg&s",
      },
    },

    socketId: String,
  },
  { timestamps: true }
);

UserSchema.plugin(plm);

const UserCollection = mongoose.model("user", UserSchema);
module.exports = UserCollection; //exporting the model so that it can be used in other
