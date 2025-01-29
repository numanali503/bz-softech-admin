const express = require("express");
const router = express.Router();
const {
  getAllEmails,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
} = require("../controllers/emailController");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

// Apply API key middleware to all routes
router.use(apiKeyMiddleware);

// Base email routes
router.route("/").get(getAllEmails).post(createEmail);

// Operations on specific email by ID
router.route("/:id").get(getEmailById).put(updateEmail).delete(deleteEmail);

module.exports = router;
