const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const messageCollection = mongoose.model("message", messageSchema);
module.exports = messageCollection;
