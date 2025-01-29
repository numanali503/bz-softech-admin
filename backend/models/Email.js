const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    labels: {
      type: String,
      default: "inbox",
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    appGenre: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
