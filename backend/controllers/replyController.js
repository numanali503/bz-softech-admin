// controllers/replyController.js
const { query } = require("express");
const Reply = require("../models/Reply");
const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "bzsoftech.dev@gmail.com", // Set in your .env file
    pass: "sruv tbmz jvoq mztv", // Set in your .env file
  },
  logger: true, // Enable detailed logs
  debug: true, // Show debug output
});

// Send reply
const sendReply = async (req, res) => {
  try {
    const { replyTo, appGenre, subject, message } = req.body;

    // Create mail options
    const mailOptions = {
      from: "bzsoftech.dev@gmail.com",
      to: replyTo,
      subject: `${subject}`,
      text: message,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Create reply record
    const newReply = new Reply({
      replyTo,
      appGenre,
      subject,
      message,
    });

    const savedReply = await newReply.save();
    res.status(201).json(savedReply);
  } catch (error) {
    if (error.response) {
      // Nodemailer error
      console.error("Email send error:", error.response);
    } else {
      // Other errors
      console.error("Reply error:", error);
    }

    res.status(500).json({
      message: "Failed to send reply",
      error: error.message,
    });
  }
};

module.exports = {
  sendReply,
};
