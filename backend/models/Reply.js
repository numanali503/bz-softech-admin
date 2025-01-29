const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    from: {
      type: String,
      default: "bzsoftech.dev@gmail.com",
      required: true,
    },
    replyTo: {
      type: String,
      required: true,
    },
    appGenre: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
